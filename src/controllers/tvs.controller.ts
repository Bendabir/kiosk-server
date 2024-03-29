import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, DeletedTVError, InactiveError,  ResourceNotFoundError } from "../exceptions";
import { Content, Group, TV, TVInterface } from "../models";
import { WebSocketTarget } from "../websocket";
import { Controllers } from "./index";

export class TVsController {
    private controllers: Controllers;

    constructor(controllers: Controllers) {
        this.controllers = controllers;
    }

    /** Get all TVs stored in database. Linked contents and groups can be
     *  resolved.
     *
     * @param filters Additional filters to use (`group`, `content` and/or
     *                `active`).
     * @param resolve Define if linked objects should be gathered (instead
     *                of foreign key only). Default is false (no resolve).
     *
     * @returns TVs.
     */
    public async getAll(filters: any = {}, resolve: boolean = false): Promise<TV[]> {
        const options: any = {
            where: {}
        };

        for (const param of ["group", "content", "active"]) {
            if (filters[param] !== undefined) {
                options.where[param] = filters[param];
            }
        }

        if (resolve) {
            options.include = [{
                model: Content
            }, {
                model: Group
            }];
        }

        return await TV.findAll(options);
    }

    /** Get one particular TV.
     *
     * @param id ID of the TV to get.
     * @param resolve Define if linked objects should be gathered (instead
     *                of foreign key only). Default is false (no resolve).
     *
     * @returns TV.
     *
     * @throws ResourceNotFoundError, if TV is not found.
     */
    public async getOne(id: string, resolve: boolean = false): Promise<TV> {
        const options: any = {
            where: {
                id
            }
        };

        // Group/Content can be null, so no required needed
        if (resolve) {
            options.include = [{
                model: Content
            }, {
                model: Group
            }];
        }

        const tv = await TV.findOne(options);

        if (!tv) {
            throw new ResourceNotFoundError(`TV '${id}' doesn't exists.`);
        }

        return tv;
    }

    /** Add one new TV to the database. Please note that only some
     *  fields are settable : `id`, `displayName`, `description`, `active`,
     *  `content` and `group`.
     *
     * @param payload TV data.
     *
     * @returns Added TV.
     *
     * @throws BadRequestError, if the content or group is not valid.
     * @throws BadRequestError, if the TV is not valid.
     * @throws ConflictError, if the TV already exists.
     */
    public async addOne(payload: TVInterface): Promise<TV> {
        try {
            const tv =  await TV.create(payload, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "active",
                    "content",
                    "group"
                ]
            });

            // Cast content to TV on creation
            if (tv.active) {
                this.controllers.websocket.display(WebSocketTarget.ONE, tv.id, await tv.getContent());
            } else {
                this.controllers.websocket.throw(tv.id, new InactiveError());
            }

            // Join a room for group support
            if (tv.group) {
                this.controllers.websocket.join(tv.id, await tv.getGroup());
            }

            return tv;
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw new ConflictError(`TV with id '${payload.id}' already exists.`);
            } else if (err instanceof ForeignKeyConstraintError) {
                throw new BadRequestError(`Content or group is not valid.`);
            } else if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Update one TV in database. Note that only `displayName`,
     *  `description`, `active`, `group` and `content` fields can be
     *  updated.
     *
     * @param id ID of the TV to update.
     * @param patch Data to patch.
     *
     * @returns Updated TV.
     *
     * @throws BadRequestError, if the content or group is not valid.
     * @throws BadRequestError, if the patch data are not valid.
     */
    public async updateOne(id: string, patch: TVInterface, fields: string[] = null): Promise<TV> {
        const tv = await this.getOne(id);

        if (fields === null) {
            fields = [
                "displayName",
                "description",
                "active",
                "group",
                "content",
                "brightness",
                "muted",
                "volume",
                "showTitle"
            ];
        }

        try {
            // tv.changed("content") is not working...
            const previous = {
                active: tv.active,
                brightness: tv.brightness,
                content: tv.content,
                group: tv.group,
                muted: tv.muted,
                showTitle: tv.showTitle,
                volume: tv.volume
            };

            await tv.update(patch, {
                fields
            });

            // Check if the TV is active
            if (tv.active) {
                // Cast the content if needed
                if (previous.content !== tv.content || previous.active !== tv.active) {
                    this.controllers.websocket.display(WebSocketTarget.ONE, tv.id, await tv.getContent());
                }

                // NOTE : Perhaps we could batch these updates into a single call for efficiency
                if (previous.brightness !== tv.brightness || previous.active !== tv.active) {
                    this.controllers.websocket.brightness(WebSocketTarget.ONE, tv.id, tv.brightness);
                }

                if (previous.muted !== tv.muted || previous.active !== tv.active) {
                    this.controllers.websocket.mute(WebSocketTarget.ONE, tv.id, tv.muted);
                }

                if (previous.volume !== tv.volume || previous.active !== tv.active) {
                    this.controllers.websocket.volume(WebSocketTarget.ONE, tv.id, tv.volume);
                }

                if (previous.showTitle !== tv.showTitle || previous.active !== tv.active) {
                    this.controllers.websocket.showTitle(WebSocketTarget.ONE, tv.id, tv.showTitle);
                }
            } else if (previous.active !== tv.active) {
                this.controllers.websocket.throw(tv.id, new InactiveError());
            }

            if (previous.group !== tv.group) {
                this.controllers.websocket.join(tv.id, await tv.getGroup());
            }

            return tv;
        } catch (err) {
            if (err instanceof ForeignKeyConstraintError) {
                throw new BadRequestError(`Content or group is not valid.`);
            } else if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Delete one TV from the database.
     *
     * @param id ID of the TV to delete.
     */
    public async deleteOne(id: string): Promise<void> {
        const tv = await this.getOne(id);
        await tv.destroy();

        // Tell the screen the TV has been deleted
        this.controllers.websocket.throw(id, new DeletedTVError());
    }
}
