import { ResourceNotFoundError } from "../../exceptions";
import { Content, Group, TV } from "../../models";
import { fixAssociations } from "../../models/utils";
import { wrap } from "./utils";

export const getAll = wrap(async (req, res) => {
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

export const getOne = wrap(async (req, res) => {
    const options: any = {
        where: {
            id: req.params.id
        }
    };

    if (req.query.resolve === "true") {
        options.include = [{
            model: Content,
            required: true
        }, {
            model: Group,
            required: true
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
