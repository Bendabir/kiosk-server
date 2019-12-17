import * as http from "http-status-codes";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ResourceNotFoundError } from "../../exceptions";
import { Content, ContentType, PlaylistItem } from "../../models";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    const options: any = {
        where: {
            type: ContentType.PLAYLIST
        }
    };

    res.json({
        data: await Content.findAll(options)
    });
});

export const get = wrap(async (req, res) => {
    const playlist = await Content.findOne({
        where: {
            id: req.params.id,
            type: ContentType.PLAYLIST
        }
    });

    if (!playlist) {
        throw new ResourceNotFoundError(`Playlist '${req.params.id}' doesn't exists.`);
    }

    res.json({
        data: playlist
    });
});

export const add = wrap(async (req, res) => {
    try {
        req.body.type = ContentType.PLAYLIST;
        req.body.uri = null;

        res.status(http.CREATED).json({
            data: await Content.create(req.body, {
                fields: [
                    "id",
                    "displayName",
                    "description",
                    "type",
                    "uri"
                ]
            })
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError(`Playlist with id '${req.body.id}' already exists.`);
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

export const update = wrap(async (req, res) => {
    const playlist = await Content.findOne({
        where: {
            id: req.params.id,
            type: ContentType.PLAYLIST
        }
    });

    if (!playlist) {
        throw new ResourceNotFoundError(`Playlist '${req.params.id}' doesn't exists.`);
    }

    try {
        res.json({
            data: await playlist.update(req.body, {
                fields: [
                    "displayName",
                    "description"
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
    const playlist = await Content.findOne({
        where: {
            id: req.params.id,
            type: ContentType.PLAYLIST
        }
    });

    if (!playlist) {
        throw new ResourceNotFoundError(`Playlist '${req.params.id}' doesn't exists.`);
    }

    await playlist.destroy();

    res.status(http.NO_CONTENT).send();
});
