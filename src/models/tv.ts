import { DataTypes, Model } from "sequelize";
import { Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from "sequelize";
import { sequelize } from "../database";
import { Content } from "./content";
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
        Group: Association<TV, Group>,
        Content: Association<TV, Content>
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
    public readonly group!: Group | null;
    public readonly content!: Content | null;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getGroup!: BelongsToGetAssociationMixin<Group>;
    public setGroup!: BelongsToSetAssociationMixin<Group, string>;
    public getContent!: BelongsToGetAssociationMixin<Content>;
    public setContent!: BelongsToSetAssociationMixin<Content, string>;
}

/* tslint:disable:object-literal-sort-keys */
TV.init({
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
    },
    screenSize: {
        type: new DataTypes.STRING(11),
        allowNull: true,
        defaultValue: null,
        validate: {
            is: {
                args: /\d{3,5}x\d{3,5}/i,
                msg: "Screen size must be of format 'widthxheight'."
            }
        },
        set(size) {
            this.setDataValue("screenSize", size.toString().toLowerCase());
        }
    },
    machine: {
        type: new DataTypes.STRING(256),
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: {
                msg: "Machine cannot be an empty string."
            }
        }
    },
    ip: {
        type: new DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
        validate: {
            isIPv4: {
                msg: "IP must be of format 'www.xxx.yyy.zzz'."
            }
        }
    },
    version: {
        type: new DataTypes.STRING(8),
        allowNull: true,
        defaultValue: null,
        validate: {
            is: {
                args: /^\d{1,2}\.\d{1,2}\.\d{1,2}$/,
                msg: "Version must be of format 'x.y.z'."
            }
        }
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

TV.belongsTo(Content, {
    // as: "Content", // Name in TV.associations
    foreignKey: {
        allowNull: true,
        name: "content"
    },
    targetKey: "id"
});
