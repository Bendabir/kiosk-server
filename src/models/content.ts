import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export enum ContentType {
    IMAGE = "image",
    TEXT = "text", // If an URI cannot be parsed, it will fallback to this
    VIDEO = "video",
    WEBPAGE = "webpage",
    YOUTUBE = "youtube",
    PLAYLIST = "playlist"
}

export interface IContent {
    id: string;
    displayName?: string | null;
    description?: string | null;
    type?: ContentType;
    uri?: string | null;
    thumbnail?: string | null;
    duration?: number | null;
    mimeType?: string | null;
}

export class Content extends Model {
    public id!: string;
    public displayName!: string | null;
    public description!: string | null;
    public type!: ContentType;
    public uri!: string | null;
    public thumbnail!: string | null;
    public duration!: number | null;
    public mimeType!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/* tslint:disable:object-literal-sort-keys */
Content.init({
    id: {
        type: new DataTypes.STRING(32),
        primaryKey: true,
        validate: {
            is: {
                args: /^[a-zA-Z0-9_\-]+$/igm,
                msg: "ID must be of alphanumeric characters, underscores or hypens."
            }
        }
    },
    displayName: {
        type: new DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "Display name cannot be an empty string."
            }
        }
    },
    description: {
        type: new DataTypes.TEXT(),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "Description cannot be an empty string."
            }
        }
    },
    type: {
        type: new DataTypes.ENUM({
            values: Object.values(ContentType)
        }),
        allowNull: false
    },
    uri: {
        type: new DataTypes.STRING(256),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "URI cannot be an empty string."
            }
        }
    },
    thumbnail: {
        type: new DataTypes.TEXT(),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "Thumbnail cannot be an empty string."
            }
        }
    },
    duration: {
        type: DataTypes.INTEGER, // Unsigned, but PostgreSQL is only INTEGER
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 1
        }
    },
    mimeType: {
        type: new DataTypes.STRING(32),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "MIME type cannot be an empty string."
            }
        },
        set(type) {
            this.setDataValue("mimeType", type.toString().toLowerCase());
        }
    }
}, {
    sequelize,
    tableName: "contents",
    underscored: true,
    validate: {
        onlyPlaylistsCannotHaveURI() {
            if (this.type !== ContentType.PLAYLIST && this.uri === null) {
                throw new Error("URI must be provided.");
            } else if (this.type === ContentType.PLAYLIST && this.uri !== null) {
                throw new Error("Playlist cannot have an URI.");
            }
        }
    }
});
