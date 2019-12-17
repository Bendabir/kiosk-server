import { DataTypes, Model } from "sequelize";
import { Association, BelongsToManyGetAssociationsMixin } from "sequelize";
import { sequelize } from "../database";
import { Content, ContentType } from "./content.model";

export interface IPlaylistItem {
    id: number;
    index: number;
    nowPlaying: boolean;
}

export class PlaylistItem extends Model {
    public static associations: {
        Playlist: Association<PlaylistItem, Content>,
        Content: Association<PlaylistItem, Content>
    };

    public id!: number;
    public readonly playlist!: Content;
    public readonly content!: Content;
    public index!: number;
    public nowPlaying!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getPlaylist!: BelongsToManyGetAssociationsMixin<Content>;
    public getContent!: BelongsToManyGetAssociationsMixin<Content>;
}

/* tslint:disable:object-literal-sort-keys */
PlaylistItem.init({
    id: {
        type: new DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    playlist: {
        type: new DataTypes.STRING(32),
        allowNull: false,
        unique: "playlist_content_order"
    },
    index: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
        unique: "playlist_content_order",
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    content: {
        type: new DataTypes.STRING(32),
        allowNull: false
    },
    nowPlaying: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: "playlists_items",
    underscored: true
});

Content.belongsToMany(Content, {
    as: "PlaylistItemContent",
    through: {
        model: PlaylistItem,
        unique: false
    },
    foreignKey: "content"
});

Content.belongsToMany(Content, {
    as: "PlaylistItemPlaylist",
    through: {
        model: PlaylistItem,
        unique: false
    },
    scope: {
        type: ContentType.PLAYLIST
    },
    foreignKey: "playlist"
});
