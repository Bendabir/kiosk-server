import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Content, ContentType } from "./content";

export interface IPlaylistItem {
    id: number;
    playlist: Content;
    content: Content;
    index: number;
    nowPlaying: boolean;
}

export class PlaylistItem extends Model {
    public id!: number;
    public playlist!: Content;
    public content!: Content;
    public index!: number;
    public nowPlaying!: boolean;
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
        unique: "playlist_content_order"
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
