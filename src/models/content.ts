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

export interface IContent extends Model {
    id: string;
    displayName?: string | null;
    description?: string | null;
    type?: ContentType;
    uri?: string;
    thumbnail?: string | null;
    duration?: number | null;
    mimeType?: string | null;
}

export class Content extends Model {
    public id!: string;
    public displayName!: string | null;
    public description!: string | null;
    public type!: ContentType;
    public uri!: string;
    public thumbnail!: string | null;
    public duration!: number | null;
    public mimeType!: string | null;
}

/* tslint:disable:object-literal-sort-keys */
Content.init({
    id: {
        type: new DataTypes.STRING(32),
        primaryKey: true
    },
    displayName: {
        type: new DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null
    },
    description: {
        type: new DataTypes.TEXT(),
        allowNull: true,
        defaultValue: null
    },
    type: {
        type: new DataTypes.ENUM({
            values: Object.values(ContentType)
        }),
        allowNull: false
    },
    uri: {
        type: new DataTypes.STRING(256),
        allowNull: false
    },
    thumbnail: {
        type: new DataTypes.TEXT(),
        allowNull: true,
        defaultValue: null
    },
    duration: {
        type: DataTypes.INTEGER, // Unsigned, but PostgreSQL is only INTEGER
        allowNull: true,
        defaultValue: null
    },
    mimeType: {
        type: new DataTypes.STRING(32),
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    tableName: "contents",
    underscored: true
});
