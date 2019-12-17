import * as http from "http-status-codes";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../../exceptions";
import { Content, Group, TV } from "../../models";
import { fixAssociations } from "../../models/utils";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    const options: any = {
        where: {}
    };

    for (const param of ["group", "content", "active"]) {
        if (req.query[param]) {
            options.where[param] = req.query[param];
        }
    }

    if (req.query.resolve === "true") {
        options.include = [{
            model: Content
        }, {
            model: Group
        }];
    }

    res.json({
        data: (await TV.findAll(options)).map(fixAssociations)
    });
});

export const get = wrap(async (req, res) => {
    const options: any = {
        where: {
            id: req.params.id
        }
    };

    if (req.query.resolve === "true") {
        options.include = [{
            model: Content
        }, {
            model: Group
        }];
    }

    const tv = await TV.findOne(options);

    if (!tv) {
        throw new ResourceNotFoundError(`TV '${req.params.id}' doesn't exists.`);
    }

    res.json({
        data: fixAssociations(tv)
    });
});

export const add = wrap(async (req, res) => {
    try {
        res.status(http.CREATED).json({
            data: await TV.create(req.body, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "active",
                    "content",
                    "group"
                ]
            })
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError(`TV with id '${req.body.id}' already exists.`);
        } else if (err instanceof ForeignKeyConstraintError) {
            throw new BadRequestError(`Content or group is not valid.`);
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

export const update = wrap(async (req, res) => {
    const tv = await TV.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!tv) {
        throw new ResourceNotFoundError(`TV '${req.params.id}' doesn't exists.`);
    }

    try {
        res.json({
            data: await tv.update(req.body, {
                fields: [
                    "displayName",
                    "description",
                    "active",
                    "group",
                    "content"
                ]
            })
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
});

export const remove = wrap(async (req, res) => {
    const tv = await TV.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!tv) {
        throw new ResourceNotFoundError(`TV '${req.params.id}' doesn't exists.`);
    }

    await tv.destroy();

    res.status(http.NO_CONTENT).send();
});
