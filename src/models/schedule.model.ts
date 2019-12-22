import { DataTypes, Model } from "sequelize";
import { Association, BelongsToManyGetAssociationsMixin } from "sequelize";
import { sequelize } from "../database";
import { Content } from "./content.model";
import { TV } from "./tv.model";

export enum ScheduleOrigin {
    USER = "user",
    PLAYLIST = "playlist"
}

export interface ScheduleInterface {
    id: number;
    playAt: Date;
    origin: ScheduleOrigin;
    recurrenceDelay: number | null;
    nbRecurrences: number;
}

export class Schedule extends Model {
    public static associations: {
        TV: Association<Schedule, TV>,
        Content: Association<Schedule, Content>
    };

    public id!: number;
    public readonly tv!: TV;
    public readonly content!: Content;
    public playAt!: Date;
    public origin!: ScheduleOrigin;
    public recurrenceDelay!: number | null; // In seconds
    public nbRecurrences!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getTV!: BelongsToManyGetAssociationsMixin<TV>;
    public getContent!: BelongsToManyGetAssociationsMixin<Content>;
}

/* tslint:disable:object-literal-sort-keys */
Schedule.init({
    id: {
        type: new DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    tv: {
        type: new DataTypes.STRING(32),
        allowNull: false,
        unique: "schedule_tv_content"
    },
    content: {
        type: new DataTypes.STRING(32),
        allowNull: false
    },
    playAt: {
        type: new DataTypes.DATE(),
        allowNull: false,
        unique: "schedule_tv_content",
        validate: {
            isAfterNow(playAt: Date) {
                if (playAt <= new Date()) {
                    throw new Error("Cannot schedule a content in the past.");
                }
            }
        }
    },
    origin: {
        type: new DataTypes.ENUM({
            values: Object.values(ScheduleOrigin)
        }),
        allowNull: false
    },
    recurrenceDelay: {
        type: new DataTypes.INTEGER(),
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 1
        }
    },
    nbRecurrences: {
        type: new DataTypes.INTEGER(),
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 1
        }
    }
}, {
    sequelize,
    tableName: "schedules",
    underscored: true,
    hooks: {
        beforeValidate: (schedule, options) => {
            if (schedule.recurrenceDelay === null && schedule.nbRecurrences !== null) {
                schedule.nbRecurrences = null;
            } else if (schedule.recurrenceDelay !== null && schedule.nbRecurrences === null) {
                schedule.nbRecurrences = 1;
            }
        }
    }
});

Schedule.belongsTo(TV, {
    // as: "TV",
    foreignKey: {
        allowNull: false,
        name: "tv"
    },
    targetKey: "id"
});

Schedule.belongsTo(Content, {
    // as: "Content",
    foreignKey: {
        allowNull: false,
        name: "content"
    },
    targetKey: "id"
});
