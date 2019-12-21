import * as http from "http-status-codes";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
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

export const items: any = {};

items.all = wrap(async (req, res) => {
    const options: any = {
        order: [
            ["index", "ASC"]
        ],
        where: {
            playlist: req.params.id
        }
    };

    // if (req.query.resolve === "true") {
    //     options.include = [{
    //         model: Content,
    //         required: true
    //     }];
    // }

    res.json({
        data: await PlaylistItem.findAll(options)
    });
});

items.add = wrap(async (req, res) => {
    try {
        req.body.playlist = req.params.id;

        res.status(http.CREATED).json({
            data: await PlaylistItem.create(req.body, {
                fields: [
                    "playlist",
                    "content",
                    "index"
                ]
            })
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError("A content already occupies this position in the playlist.");
        } else if (err instanceof ForeignKeyConstraintError) {
            throw new BadRequestError(`Playlist or content is not valid.`);
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

items.update = wrap(async (req, res) => {
    const item = await PlaylistItem.findOne({
        where: {
            index: req.params.index,
            playlist: req.params.id
        }
    });

    if (!item) {
        throw new ResourceNotFoundError(`No content at index '${req.params.index}' for playlist '${req.params.id}'.`);
    }

    try {
        res.json({
            data: await item.update(req.body, {
                fields: [
                    "index"
                ]
            })
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new ConflictError("A content already occupies this position in the playlist.");
        } else if (err instanceof ValidationError) {
            throw new BadRequestError(err.message);
        } else {
            throw err;
        }
    }
});

items.remove = wrap(async (req, res) => {
    const item = await PlaylistItem.findOne({
        where: {
            index: req.params.index,
            playlist: req.params.id
        }
    });

    if (!item) {
        throw new ResourceNotFoundError(`No content at index '${req.params.index}' for playlist '${req.params.id}'.`);
    }

    await item.destroy();

    res.status(http.NO_CONTENT).send();
});
