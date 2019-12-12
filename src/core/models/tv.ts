import { DataTypes, Model } from "sequelize";
import { Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from "sequelize";
import { sequelize } from "../../database";
import { Group } from "./group";

export interface ITV {
    id: string;
    displayName?: string | null;
    description?: string | null;
    active?: boolean;
    screenSize?: string | null;
    machine?: string | null;
    ip?: string | null;
    version?: string | null;
}

export class TV extends Model {
    public static associations: {
        Group: Association<TV, Group>
    };

    public id!: string;
    public displayName!: string | null;
    public description!: string | null;
    public active!: boolean;
    public screenSize!: string | null;
    public machine!: string | null;
    public ip!: string | null;
    public version!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly group!: string | null;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getGroup!: BelongsToGetAssociationMixin<Group>;
    public setGroup!: BelongsToSetAssociationMixin<Group, string>;
}

/* tslint:disable:object-literal-sort-keys */
TV.init({
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
    },
    screenSize: {
        type: new DataTypes.STRING(11),
        allowNull: true,
        defaultValue: null
    },
    machine: {
        type: new DataTypes.STRING(256),
        allowNull: true,
        defaultValue: null
    },
    ip: {
        type: new DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null
    },
    version: {
        type: new DataTypes.STRING(8),
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    tableName: "tvs",
    underscored: true
});

TV.belongsTo(Group, {
    // as: "Group", // Name in TV.associations
    foreignKey: {
        allowNull: true,
        name: "group"
    },
    targetKey: "id"
});

if (process.env.NODE_ENV !== "production") {
    TV.sync(); // For production, we'll need to implement migrations
}
