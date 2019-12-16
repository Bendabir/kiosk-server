import * as http from "http-status-codes";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../../exceptions";
import { Group } from "../../models";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    const options: any = {
        where: {}
    };

    if (req.query.active) {
        options.where.active = req.query.active;
    }

    res.json({
        data: await Group.findAll(options)
    });
});

export const get = wrap(async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!group) {
        throw new ResourceNotFoundError(`Group '${req.params.id}' doesn't exists.`);
    }

    res.json({
        data: group
    });
});

export const add = wrap(async (req, res) => {
    try {
        res.status(http.CREATED).json({
            data: await Group.create(req.body)
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError(`Group with id '${req.body.id}' already exists.`);
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

export const update = wrap(async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!group) {
        throw new ResourceNotFoundError(`Group '${req.params.id}' doesn't exists.`);
    }

    try {
        res.json({
            data: await group.update(req.body, {
                fields: [
                    "displayName", "description", "active"
                ]
            })
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

export const remove = wrap(async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.id
        }
    });

    if (group === null) {
        throw new ResourceNotFoundError(`Group '${req.params.id}' doesn't exists.`);
    }

    await group.destroy();

    res.status(http.NO_CONTENT).send();
});
