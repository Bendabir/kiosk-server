import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface GroupInterface {
    id?: string;
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
        allowNull: false,
        validate: {
            is: {
                args: /^[a-zA-Z0-9_\-]+$/igm,
                msg: "ID must be of alphanumeric characters, underscores or hypens."
            },
            len: {
                args: [1, 32],
                msg: "ID must have length between 1 and 32."
            }
        }
    },
    displayName: {
        type: new DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
        validate: {
            len: {
                args: [1, 64],
                msg: "Display name must have length between 1 and 64."
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
    underscored: true,
    hooks: {
        beforeValidate: (group, options) => {
            if (group.displayName === "" || group.displayName === null) {
                group.displayName = group.id;
            }

            if (group.description === "") {
                group.description = null;
            }
        }
    }
});
