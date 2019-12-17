import * as http from "http-status-codes";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ForbiddenError, ResourceNotFoundError } from "../../exceptions";
import { Content, Schedule, ScheduleOrigin, TV } from "../../models";
import { fixAssociations } from "../../models/utils";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    const options: any = {
        order: [
            ["playAt", "ASC"]
        ],
        where: {}
    };

    for (const param of ["tv", "content", "origin"]) {
        if (req.query[param]) {
            options.where[param] = req.query[param];
        }
    }

    if (req.query.resolve === "true") {
        options.include = [{
            model: Content,
            required: true
        }, {
            model: TV,
            required: true
        }];
    }

    res.json({
        data: (await Schedule.findAll(options)).map(fixAssociations)
    });
});

export const add = wrap(async (req, res) => {
    try {
        req.body.origin = ScheduleOrigin.USER;

        res.status(http.CREATED).json({
            data: await Schedule.create(req.body, {
                fields: [
                    "tv",
                    "content",
                    "playAt",
                    "recurrenceDelay",
                    "nbRecurrences",
                    "origin"
                ]
            })
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
});

export const remove = wrap(async (req, res) => {
    const schedule = await Schedule.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!schedule) {
        throw new ResourceNotFoundError(`Schedule '${req.params.id}' doesn't exists.`);
    }

    if (schedule.origin !== ScheduleOrigin.USER) {
        throw new ForbiddenError("Schedule deletion is not allowed for internal schedules.");
    }

    await schedule.destroy();

    res.status(http.NO_CONTENT).send();
});
