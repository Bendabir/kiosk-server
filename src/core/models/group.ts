import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database";

class Group extends Model {
    public id!: string;
    public displayName!: string;
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
        unique: true,
        allowNull: false
    },
    description: {
        type: new DataTypes.TEXT(),
        allowNull: true
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

export { Group };
