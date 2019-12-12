import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface IGroup {
    id: string;
    displayName?: string | null;
    description?: string | null;
    active?: boolean;
}

export class Group extends Model {
    public id!: string;
    public displayName!: string | null;
    public description!: string | null;
    public active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/* tslint:disable:object-literal-sort-keys */
Group.init({
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
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: "groups",
    underscored: true
});

if (process.env.NODE_ENV !== "production") {
    Group.sync(); // For production, we'll need to implement migrations
}
