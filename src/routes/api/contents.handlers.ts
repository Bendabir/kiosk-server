import * as http from "http-status-codes";
import { DatabaseError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../../exceptions";
import { Content } from "../../models";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    const options: any = {
        where: {}
    };

    if (req.query.type) {
        options.where.type = req.query.type;
    }

    res.json({
        data: await Content.findAll(options)
    });
});

export const get = wrap(async (req, res) => {
    const content = await Content.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!content) {
        throw new ResourceNotFoundError(`Content '${req.params.id}' doesn't exists.`);
    }

    res.json({
        data: content
    });
});

export const add = wrap(async (req, res) => {
    try {
        res.status(http.CREATED).json({
            data: await Content.create(req.body)
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError(`Content with id '${req.body.id}' already exists.`);
        } else if (err instanceof DatabaseError) {
            throw new BadRequestError(`Type '${req.body.type}' is not supported.`);
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

export const update = wrap(async (req, res) => {
    const content = await Content.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!content) {
        throw new ResourceNotFoundError(`Content '${req.params.id}' doesn't exists.`);
    }

    try {
        res.json({
            data: await content.update(req.body, {
                fields: [
                    "displayName", "description"
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
    const content = await Content.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!content) {
        throw new ResourceNotFoundError(`Content '${req.params.id}' doesn't exists.`);
    }

    await content.destroy();

    res.status(http.NO_CONTENT).send();
});
