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
