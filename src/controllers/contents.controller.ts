import * as mime from "mime-types";
import request from "request-promise-native";
import { Op } from "sequelize";
import { DatabaseError, UniqueConstraintError, ValidationError } from "sequelize";
import * as config from "../config";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../exceptions";
import { logger } from "../logging";
import { Content, ContentInterface, ContentType } from "../models";

export class ContentsController {
    /** Extract the video ID from a YouTube link (if possible).
     *
     * @param url URL to extract the ID from.
     *
     * @returns Video ID if link is valid, `null` otherwise.
     */
    public static extractYoutubeID(url: string): string | null {
        // tslint:disable-next-line: max-line-length
        const REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;
        const matched = url.match(REGEX);

        return (matched) ? matched[1] : null;
    }

    /** Check if an URI is a valid URL.
     *
     * @param uri URI to check.
     *
     * @returns `true` if the URI is an URL, `false` otherwise.
     */
    public static isURL(uri: string): boolean {
        const REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6}\b)?([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;

        return REGEX.test(uri);
    }

    /** Tries to infer (internal) type from an URI.
     *
     * @param uri URI to infer the (internal) type from.
     *
     * @returns The inferred type.
     */
    public static inferType(uri: string): ContentType {
        const mimeType = mime.lookup(uri.toLowerCase());

        if (mimeType) {
            if (mimeType.startsWith("image/")) {
                return ContentType.IMAGE;
            } else if (mimeType.startsWith("video/")) {
                return ContentType.VIDEO;
            } else if (mimeType.startsWith("text/html")) {
                // This should handle HTML pages with charsets as well
                return ContentType.WEBPAGE;
            } else if (mimeType.startsWith("application/x-httpd-php")) {
                return ContentType.WEBPAGE;
            }
        } else if (this.extractYoutubeID(uri) !== null) {
            return ContentType.YOUTUBE;
        } else if (this.isURL(uri)) {
            return ContentType.WEBPAGE;
        }

        // Defaulting to text content
        return ContentType.TEXT;
    }

    /** Analyse an URI and generate a possible content (not saved).
     *
     * @param uri URI to analyze.
     *
     * @returns Possible content.
     */
    public static async analyze(uri: string): Promise<Content> {
        const type = this.inferType(uri);
        let mimeType: string | null = null;

        if (type === ContentType.IMAGE || type === ContentType.VIDEO) {
            const inferred = mime.lookup(uri);

            if (inferred) {
                mimeType = inferred;
            }
        }

        const content = Content.build({
            id: Math.random().toString(36).substring(2, 15),
            mimeType,
            type,
            uri
        });
        await content.validate();

        return content;
    }

    /** Extract the URI from a content a prepare it for the display. Indeed,
     *  some raw contents such as videos or images need to be wrapped in a
     *  nice content wrapper.
     *
     * @param content Content to prepare the URI from.
     */
    public static prepareURIForDisplay(content: Content): string {
        switch (content.type) {
            case ContentType.IMAGE: return `${config.SERVER_URL}/contents/image?source=${encodeURIComponent(content.uri)}`;
            case ContentType.VIDEO: {
                if (content.mimeType) {
                    return `${config.SERVER_URL}/contents/video?source=${encodeURIComponent(content.uri)}&mime_type=${encodeURIComponent(content.mimeType)}`;
                } else {
                    return `${config.SERVER_URL}/contents/video?source=${encodeURIComponent(content.uri)}`;
                }
            }
            case ContentType.TEXT: return `${config.SERVER_URL}/contents/message?message=${encodeURIComponent(content.uri)}`;
            default: return content.uri;
        }
    }

    /** Get all contents stored in database (playlists are filtered out).
     *
     * @param type Additional type filter to use.
     *
     * @returns Contents.
     */
    public static async getAll(type: ContentType | null = null): Promise<Content[]> {
        const options: any = {
            where: {
                type: {
                    [Op.ne]: ContentType.PLAYLIST
                }
            }
        };

        if (type && type !== ContentType.PLAYLIST) {
            options.where.type = type;
        }

        return await Content.findAll(options);
    }

    /** Get one particular content (playlists are filtered out).
     *
     * @param id ID of the content to get.
     *
     * @returns Content.
     *
     * @throws ResourceNotFoundError, if content is not found.
     */
    public static async getOne(id: string): Promise<Content> {
        const content = await Content.findOne({
            where: {
                id,
                type: {
                    [Op.ne]: ContentType.PLAYLIST
                }
            }
        });

        if (!content) {
            throw new ResourceNotFoundError(`Content '${id}' doesn't exists.`);
        }

        return content;
    }

    /** Add one new content to the database. Please note that only some
     *  fields are settable : `id`, `displayName`, `description`, `type` and
     *  `uri`.
     *
     * @param payload Content data.
     *
     * @returns Added content.
     *
     * @throws BadRequestError, if the content is a playlist.
     * @throws BadRequestError, if the content type is not supported.
     * @throws BadRequestError, if the content is not valid.
     * @throws ConflictError, if the content already exists.
     */
    public static async addOne(payload: ContentInterface): Promise<Content> {
        if (payload.type === ContentType.PLAYLIST) {
            throw new BadRequestError("Unexpected content type.");
        }

        try {
            // Make sure the URI are uniform (especially for YouTube contents)
            payload.uri = this.uniformizeURI(payload.uri, payload.type);

            const content = await Content.create(payload, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "type",
                    "uri"
                ]
            });

            // Generating a thumbnail for the content, but asynchronously
            this.generateThumbnail(content.uri, content.type).then(async (thumbnail) => {
                // Can be empty, but model supports it so nevermind
                await content.update({
                    thumbnail
                });
            }).catch((err) => {
                logger.error(`Error generating thumbnail for content '${content.id}' : ${err.message}`);
            });

            return content;
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw new ConflictError(`Content with id '${payload.id}' already exists.`);
            } else if (err instanceof DatabaseError) {
                throw new BadRequestError(`Type '${payload.type}' is not supported.`);
            } else if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Update one content in database. Note that only `displayName` and
     *  `description` fields can be updated.
     *
     * @param id ID of the content to update.
     * @param patch Data to patch.
     *
     * @returns Updated content.
     *
     * @throws BadRequestError, if the patch data are not valid.
     */
    public static async updateOne(id: string, patch: ContentInterface): Promise<Content> {
        const content = await this.getOne(id);

        try {
            // Cannot update all fields
            return await content.update(patch, {
                fields: [
                    "displayName",
                    "description"
                ]
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Delete one content from the database.
     *
     * @param id ID of the content to delete.
     */
    public static async deleteOne(id: string): Promise<void> {
        const content = await this.getOne(id);
        await content.destroy();
    }

    /** Tries to generate a content thumbnail.
     *
     * @param uri URI to generate the thumbnail from.
     * @param type Type (internal) of the URI.
     *
     * @returns Generated thumbnail (if possible) as an URI or a Base 64
     *          content, `null` otherwise.
     */
    private static async generateThumbnail(uri: string, type: ContentType): Promise<string | null> {
        switch (type) {
            case ContentType.WEBPAGE: {
                // Using Google API to generate a thumbnail
                // NOTE : This is very long to process (~16 seconds)
                //        so this must be asynchronous
                const API_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

                const response = await request({
                    json: true,
                    qs: {
                        category: "performance",
                        strategy: "desktop",
                        url: uri
                    },
                    uri: API_ENDPOINT
                });

                return response["final-screenshot"].details.data;
            }
            case ContentType.YOUTUBE: {
                return `https://img.youtube.com/vi/${this.extractYoutubeID(uri)}/hqdefault.jpg`;
            }
            // TODO : Handle image and video thumbnail generation with
            //        simple-thumbnail package
            default: {
                return null;
            }
        }
    }

    /** Uniformize an URI for internal storage.
     *
     * @param uri URI to uniformize.
     * @param type Content type.
     *
     * @returns Uniformized URI.
     */
    private static uniformizeURI(uri: string, type: ContentType): string {
        switch (type) {
            case ContentType.YOUTUBE : {
                const params = {
                    autoplay: "1",
                    cc_load_policy: "0",
                    color: "white",
                    controls: "0",
                    iv_load_policy: "3",
                    loop: "1",
                    modestbranding: "0",
                    rel: "0"
                };
                const queryParams = Object.entries(params).map((entry) => {
                    return entry.join("=");
                }).join("&");
                const id = this.extractYoutubeID(uri);

                // TODO : For YouTube playlists, there is probably something
                //        fancy we can do

                // See API documentation for details :
                // https://developers.google.com/youtube/player_parameters
                return `https://www.youtube.com/embed/${id}?${queryParams}`;
            }
            default: return uri;
        }
    }
}
