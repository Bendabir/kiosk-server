import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ForbiddenError, ResourceNotFoundError } from "../exceptions";
import { Content, Schedule, ScheduleInterface, ScheduleOrigin, TV } from "../models";
import { fixAssociations } from "../models/utils";

export class SchedulesController {
    /** Get all schedules stored in database. Linked contents and groups
     *  can be resolved.
     *
     * @param filters Additional filters to use (`tv`, `content` and/or
     *                `origin`).
     * @param resolve Define if linked objects should be gathered (instead
     *                of foreign key only). Default is false (no resolve).
     *
     * @returns Schedules.
     */
    public static async getAll(filters: any = {}, resolve: boolean = false): Promise<Schedule[]> {
        const options: any = {
            order: [
                ["playAt", "ASC"]
            ],
            where: {}
        };

        for (const param of ["tv", "content", "origin"]) {
            if (filters[param] !== undefined) {
                options.where[param] = filters[param];
            }
        }

        if (resolve) {
            options.include = [{
                model: Content,
                required: true
            }, {
                model: TV,
                required: true
            }];
        }

        return (await Schedule.findAll(options)).map(fixAssociations);
    }

    /** Get one particular schedule.
     *
     * @param id ID of the schedule to get.
     *
     * @returns Schedule.
     *
     * @throws ResourceNotFoundError, if schedule is not found.
     */
    public static async getOne(id: string): Promise<Schedule> {
        const schedule = await Schedule.findOne({
            where: {
                id
            }
        });

        if (!schedule) {
            throw new ResourceNotFoundError(`Schedule '${id}' doesn't exists.`);
        }

        return schedule;
    }

    /** Add one new schedule to the database. Please note that only some
     *  fields are settable : `tv`, `content`, `playAt`, `recurrenceDelay`
     *  and `nbRecurrences`.
     *
     * @param payload Schedule data.
     *
     * @returns Added schedule.
     *
     * @throws BadRequestError, if the content or tv is not valid.
     * @throws BadRequestError, if the schedule is not valid.
     * @throws ConflictError, if the schedule already exists.
     */
    public static async addOne(payload: ScheduleInterface, origin: ScheduleOrigin): Promise<Schedule> {
        try {
            payload.origin = origin;

            return await Schedule.create(payload, {
                fields: [
                    "tv",
                    "content",
                    "playAt",
                    "recurrenceDelay",
                    "nbRecurrences",
                    "origin"
                ]
            });
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw new ConflictError("A content has already been scheduled for this TV at this time.");
            } else if (err instanceof ForeignKeyConstraintError) {
                throw new BadRequestError(`Content or TV is not valid.`);
            } else if (err instanceof ValidationError) {
                throw new BadRequestError(err.message);
            } else {
                throw err;
            }
        }
    }

    /** Delete one schedule from the database.
     *
     * @param id ID of the schedule to delete.
     * @param internal Define if playlist schedules can be deleted.
     *
     * @throws ForbiddenError, if `internal` is set and playlist
     *         schedule is deleted.
     */
    public static async deleteOne(id: string, internal: boolean = true): Promise<void> {
        const schedule = await this.getOne(id);

        if (!internal && schedule.origin !== ScheduleOrigin.USER) {
            throw new ForbiddenError("Schedule deletion is not allowed for internal schedules.");
        }

        await schedule.destroy();
    }
}
