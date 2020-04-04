import { UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../exceptions";
import { Group, GroupInterface } from "../models";

export class GroupsController {
    /** Get all groups stored in database.
     *
     * @param filters Additional filters to use (`active` and/or `on`).
     *
     * @returns Groups.
     */
    public async getAll(filters: any = {}): Promise<Group[]> {
        const options: any = {
            where: {}
        };

        for (const param of ["active", "on"]) {
            if (filters[param] !== undefined) {
                options.where[param] = filters[param];
            }
        }

        return await Group.findAll(options);
    }

    /** Get one particular group.
     *
     * @param id ID of the group to get.
     *
     * @returns Group.
     *
     * @throws ResourceNotFoundError, if group is not found.
     */
    public async getOne(id: string): Promise<Group> {
        const group = await Group.findOne({
            where: {
                id
            }
        });

        if (!group) {
            throw new ResourceNotFoundError(`Group '${id}' doesn't exists.`);
        }

        return group;
    }

    /** Add one new group to the database. Please note that only some
     *  fields are settable : `id`, `displayName`, `description` and
     *  `active`.
     *
     * @param payload Group data.
     *
     * @returns Added group.
     *
     * @throws BadRequestError, if the TV is not valid.
     * @throws ConflictError, if the TV already exists.
     */
    public async addOne(payload: GroupInterface): Promise<Group> {
        try {
            return await Group.create(payload, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "active"
                ]
            });
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw new ConflictError(`Group with id '${payload.id}' already exists.`);
            } else if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Update one group in database. Note that only `displayName`,
     *  `description` and `active` fields can be updated.
     *
     * @param id ID of the group to update.
     * @param patch Data to patch.
     *
     * @returns Updated group.
     *
     * @throws BadRequestError, if the patch data are not valid.
     */
    public async updateOne(id: string, patch: GroupInterface): Promise<Group> {
        const group = await this.getOne(id);

        try {
            return await group.update(patch, {
                fields: [
                    "displayName",
                    "description",
                    "active"
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

    /** Delete one group from the database.
     *
     * @param id ID of the group to delete.
     */
    public async deleteOne(id: string): Promise<void> {
        const group = await this.getOne(id);
        await group.destroy();
    }
}
