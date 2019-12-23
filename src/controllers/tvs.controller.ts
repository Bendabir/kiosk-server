import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../exceptions";
import { Content, Group, TV, TVInterface } from "../models";

export class TVsController {
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
    public static async getAll(filters: any = {}, resolve: boolean = false): Promise<TV[]> {
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
    public static async getOne(id: string, resolve: boolean = false): Promise<TV> {
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
    public static async addOne(payload: TVInterface): Promise<TV> {
        try {
            return await TV.create(payload, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "active",
                    "content",
                    "group"
                ]
            });
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
    public static async updateOne(id: string, patch: TVInterface): Promise<TV> {
        const tv = await this.getOne(id);

        try {
            return await tv.update(patch, {
                fields: [
                    "displayName",
                    "description",
                    "active",
                    "group",
                    "content"
                ]
            });
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
    public static async deleteOne(id: string): Promise<void> {
        const tv = await this.getOne(id);
        await tv.destroy();
    }
}
