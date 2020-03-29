import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ForbiddenError, ResourceNotFoundError } from "../exceptions";
import { logger } from "../logging";
import { Content, Schedule, ScheduleInterface, ScheduleOrigin, TV } from "../models";
import { Controllers } from "./index";

export class SchedulesController {
    /** Compute a timeout from now to execute something at a given date.
     */
    public static timeoutFromNow(targetDate: Date): number {
        return targetDate.getTime() - new Date().getTime();
    }

    private controllers: Controllers;
    private tasks: Map<number, NodeJS.Timeout> = new Map();

    constructor(controllers: Controllers) {
        this.controllers = controllers;
    }

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
    public async getAll(filters: any = {}, resolve: boolean = false): Promise<Schedule[]> {
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

        return await Schedule.findAll(options);
    }

    /** Get one particular schedule.
     *
     * @param id ID of the schedule to get.
     *
     * @returns Schedule.
     *
     * @throws ResourceNotFoundError, if schedule is not found.
     */
    public async getOne(id: number): Promise<Schedule> {
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
    public async addOne(payload: ScheduleInterface, origin: ScheduleOrigin): Promise<Schedule> {
        try {
            payload.origin = origin;

            const schedule = await Schedule.create(payload, {
                fields: [
                    "tv",
                    "content",
                    "playAt",
                    "recurrenceDelay",
                    "nbRecurrences",
                    "origin"
                ]
            });

            this.plan(schedule);

            return schedule;
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
    public async deleteOne(id: number, internal: boolean = true): Promise<void> {
        const schedule = await this.getOne(id);

        if (!internal && schedule.origin !== ScheduleOrigin.USER) {
            throw new ForbiddenError("Schedule deletion is not allowed for internal schedules.");
        }

        this.cancel(schedule);

        await schedule.destroy();
    }

    /** Load all schedules in the database at boot time.
     */
    public async load() {
        const schedules = await this.getAll();
        const now = new Date();

        if (schedules.length > 0) {
            logger.info(`Loaded ${schedules.length} schedule(s) from the database.`);
        }

        schedules.forEach((s) => {
            // If the schedule was in the past, playing straight ahead (otherwise plan it)
            // Note that schedules are sorted asc
            if (s.playAt < now) {
                this.execute(s);
            } else {
                this.plan(s);
            }
        });
    }

    /** Abort one scheduled tasks.
     *
     * @param id Schedule ID in the database to cancel.
     */
    private cancel(schedule: Schedule): boolean {
        // clearTimeout is safe against null/undefined values
        logger.info(`Cancel content '${schedule.content}' for TV '${schedule.tv}' originally scheduled at ${schedule.playAt}`);
        clearTimeout(this.tasks.get(schedule.id));
        return this.tasks.delete(schedule.id);
    }

    /** Execute a schedule.
     */
    private async execute(schedule: Schedule) {
        logger.info(`Cast content '${schedule.content}' to TV '${schedule.tv}' (scheduled at ${schedule.playAt}).`);

        // First we update the database
        // The TV controller handles the cast through Websocket
        try {
            // A bit dirty
            const patch: object = {
                content: schedule.content
            };

            await this.controllers.tv.updateOne(schedule.tv, patch, ["content"]);

            // Finally, we remove the schedule from the database
            this.tasks.delete(schedule.id);
            await schedule.destroy();
        } catch (err) {
            logger.error(`Error executing schedule : ${err.message}`);
        }
    }

    private plan(schedule: Schedule) {
        logger.info(`Schedule content '${schedule.content}' for TV '${schedule.tv}' at ${schedule.playAt}.`);

        const timeout = SchedulesController.timeoutFromNow(schedule.playAt);
        // Avoid 'this' binding issue in timeout
        const task = setTimeout(async () => await this.execute(schedule), timeout);

        this.tasks.set(schedule.id, task);
    }
}
