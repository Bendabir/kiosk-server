import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../exceptions";
import { Content, ContentInterface, ContentType, PlaylistItem, PlaylistItemInterface } from "../models";

// TODO : Move playlists outside content definition

export class PlaylistsController {
    // /** Get all playlists stored in database.
    //  *
    //  * @returns Playlists.
    //  */
    // public static async getAll(): Promise<Content[]> {
    //     return await Content.findAll({
    //         where: {
    //             type: ContentType.PLAYLIST
    //         }
    //     });
    // }

    // /** Get one particular playlist.
    //  *
    //  * @param id ID of the playlist to get.
    //  *
    //  * @returns Playlist.
    //  *
    //  * @throws ResourceNotFoundError, if playlist is not found.
    //  */
    // public static async getOne(id: string): Promise<Content> {
    //     const playlist = await Content.findOne({
    //         where: {
    //             id,
    //             type: ContentType.PLAYLIST
    //         }
    //     });

    //     if (!playlist) {
    //         throw new ResourceNotFoundError(`Playlist '${id}' doesn't exists.`);
    //     }

    //     return playlist;
    // }

    // /** Add one new playlist to the database. Please note that only some
    //  *  fields are settable : `id`, `displayName`, `description`, `type` and
    //  *  `uri`.
    //  *
    //  * @param payload Playlist data.
    //  *
    //  * @returns Added playlist.
    //  *
    //  * @throws BadRequestError, if the playlist is not valid.
    //  * @throws ConflictError, if the playlist already exists.
    //  */
    // public static async addOne(payload: ContentInterface): Promise<Content> {
    //     try {
    //         payload.type = ContentType.PLAYLIST;
    //         payload.uri = null;

    //         return await Content.create(payload, {
    //             fields: [
    //                 "id",
    //                 "displayName",
    //                 "description",
    //                 "type",
    //                 "uri"
    //             ]
    //         });
    //     } catch (err) {
    //         if (err instanceof UniqueConstraintError) {
    //             throw new ConflictError(`Playlist with id '${payload.id}' already exists.`);
    //         } else if (err instanceof ValidationError) {
    //             throw new BadRequestError(err.message);
    //         } else {
    //             throw err;
    //         }
    //     }
    // }

    // /** Update one playlist in database. Note that only `displayName`,
    //  *  `description`, `active`, `group` and `content` fields can be
    //  *  updated.
    //  *
    //  * @param id ID of the TV to update.
    //  * @param patch Data to patch.
    //  *
    //  * @returns Updated TV.
    //  *
    //  * @throws BadRequestError, if the content or group is not valid.
    //  * @throws BadRequestError, if the patch data are not valid.
    //  */
    // public static async updateOne(id: string, patch: ContentInterface): Promise<Content> {
    //     const playlist = await this.getOne(id);

    //     try {
    //         return await playlist.update(patch, {
    //             fields: [
    //                 "displayName",
    //                 "description"
    //             ]
    //         });
    //     } catch (err) {
    //         if (err instanceof ValidationError) {
    //             throw new BadRequestError(err.message);
    //         } else {
    //             throw err;
    //         }
    //     }
    // }

    // public static async deleteOne(id: string): Promise<void> {
    //     const playlist = await this.getOne(id);
    //     await playlist.destroy();
    // }

    // public static async getAllItems(id: string): Promise<PlaylistItem[]> {
    //     return await PlaylistItem.findAll({
    //         order: [
    //             ["index", "ASC"]
    //         ],
    //         where: {
    //             playlist: id
    //         }
    //     });
    // }

    // public static async getOneItem(id: string, index: string): Promise<PlaylistItem> {
    //     const item = await PlaylistItem.findOne({
    //         where: {
    //             index,
    //             playlist: id
    //         }
    //     });

    //     if (!item) {
    //         throw new ResourceNotFoundError(`No content at index '${index}' for playlist '${id}'.`);
    //     }

    //     return item;
    // }

    // public static async addOneItem(id: string, payload: PlaylistItemInterface): Promise<PlaylistItem> {
    //     try {
    //         payload.playlist = id;

    //         return await PlaylistItem.create(payload, {
    //             fields: [
    //                 "playlist",
    //                 "content",
    //                 "index"
    //             ]
    //         });
    //     } catch (err) {
    //         if (err instanceof UniqueConstraintError) {
    //             throw new ConflictError("A content already occupies this position in the playlist.");
    //         } else if (err instanceof ForeignKeyConstraintError) {
    //             throw new BadRequestError(`Playlist or content is not valid.`);
    //         } else if (err instanceof ValidationError) {
    //             throw new BadRequestError(err.message);
    //         } else {
    //             throw err;
    //         }
    //     }
    // }

    // tslint:disable-next-line: max-line-length
    // public static async updateOneItem(id: string, index: string, patch: PlaylistItemInterface): Promise<PlaylistItem> {
    //     const item = await this.getOneItem(id, index);

    //     try {
    //         return await item.update(patch, {
    //             fields: [
    //                 "index"
    //             ]
    //         });
    //     } catch (err) {
    //         if (err instanceof UniqueConstraintError) {
    //             throw new ConflictError("A content already occupies this position in the playlist.");
    //         } else if (err instanceof ValidationError) {
    //             throw new BadRequestError(err.message);
    //         } else {
    //             throw err;
    //         }
    //     }
    // }

    // public static async deleteOneItem(id: string, index: string): Promise<void> {
    //     const item = await this.getOneItem(id, index);
    //     await item.destroy();
    // }
}
