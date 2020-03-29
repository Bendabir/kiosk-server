import { DataTypes, Model } from "sequelize";
import { Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from "sequelize";
import { sequelize } from "../database";
import { Content } from "./content.model";
import { Group } from "./group.model";

export interface TVInterface {
    id?: string;
    displayName?: string | null;
    description?: string | null;
    active?: boolean;
    on?: boolean;
    screenSize?: string | null;
    machine?: string | null;
    ip?: string | null;
    version?: string | null;
    brightness?: number;
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
    public on!: boolean;
    public screenSize!: string | null;
    public machine!: string | null;
    public ip!: string | null;
    public version!: string | null;
    public brightness!: number;
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
    },
    on: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    screenSize: {
        type: new DataTypes.STRING(11),
        allowNull: true,
        defaultValue: null,
        validate: {
            is: {
                args: /^\d{3,5}x\d{3,5}$/i,
                msg: "Screen size must be of format '<width>x<height>'."
            }
        },
        set(size: string) {
            this.setDataValue("screenSize", size?.toLowerCase());
        }
    },
    machine: {
        type: new DataTypes.TEXT(),
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
                msg: "Version must be of format 'xx.yy.zz'."
            }
        }
    },
    brightness: {
        type: new DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 1.0,
        validate: {
            min: 0.05,
            max: 1.0
        }
    }
}, {
    sequelize,
    tableName: "tvs",
    underscored: true,
    hooks: {
        beforeValidate: (tv, _) => {
            if (tv.displayName === "" || tv.displayName === null) {
                tv.displayName = tv.id;
            }

            if (tv.description === "") {
                tv.description = null;
            }

            if (tv.screenSize === "") {
                tv.screenSize = null;
            }

            if (tv.ip === "") {
                tv.ip = null;
            }

            if (tv.machine === "") {
                tv.machine = null;
            }

            if (tv.version === "") {
                tv.version = null;
            }
        }
    }
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
