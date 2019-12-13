import { DataTypes, DATE, Model } from "sequelize";
import { sequelize } from "../database";
import { Content } from "./content";
import { TV } from "./tv";

export enum ScheduleOrigin {
    USER = "user",
    PLAYLIST = "playlist"
}

export interface ISchedule {
    id: number;
    tv: TV;
    content: Content;
    playAt: Date;
    origin: ScheduleOrigin;
    recurrenceDelay: number | null;
    nbRecurrences: number;
}

export class Schedule extends Model {
    public id!: number;
    public tv!: TV;
    public content!: Content;
    public playAt!: Date;
    public origin!: ScheduleOrigin;
    public recurrenceDelay!: number | null; // In seconds
    public nbRecurrences!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
        allowNull: false,
        unique: "schedule_tv_content",
    },
    playAt: {
        type: new DataTypes.DATE(),
        allowNull: false,
        unique: "schedule_tv_content"
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
            min: 0
        }
    },
    nbRecurrences: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    sequelize,
    tableName: "schedules",
    underscored: true,
    validate: {
        nonRecurrentSchedulesCannotHaveRecurrences() {
            if (this.recurrenceDelay === null && this.nbRecurrences > 0) {
                throw new Error("Non-recurrent schedule cannot have a number of recurrences.");
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
