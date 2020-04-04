import { ValidationError } from "sequelize";
import { Schedule, ScheduleOrigin } from "./schedule.model";

describe("Schedule Model", () => {
    describe("Create Schedule", () => {
        it("Schedule date cannot be null", () => {
            expect(Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Schedule date cannot be in the past", () => {
            expect(Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2000-01-01"),
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date(),
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });

        it("Schedule origin cannot be null", () => {
            expect(Schedule.build({
                content: "test",
                origin: null,
                playAt: new Date("2100-01-01"),
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });

        it("Recurrence delay can be null", async () => {
            await Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: null,
                tv: "test"
            }).validate();
        });
        it("Recurrence delay must be greater than 1", async () => {
            expect(Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: -1,
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 0,
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 1,
                tv: "test"
            }).validate();
        });
        it("Recurrence delay default must default to null", async () => {
            const schedule = Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                tv: "test"
            });
            await schedule.validate();

            expect(schedule.recurrenceDelay).toBeNull();
        });

        it("Recurrence number must be greater than 1", async () => {
            expect(Schedule.build({
                content: "test",
                nbRecurrences: -1,
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 1,
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Schedule.build({
                content: "test",
                nbRecurrences: 0,
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 1,
                tv: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Schedule.build({
                content: "test",
                nbRecurrences: 1,
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 1,
                tv: "test"
            }).validate();
        });
        it("Recurrence number default must default to 1 if delay is defined", async () => {
            const schedule = Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: 1,
                tv: "test"
            });
            await schedule.validate();

            expect(schedule.nbRecurrences).toEqual(1);
        });
        it("Recurrence number default must default to null if delay is not defined", async () => {
            const schedule = Schedule.build({
                content: "test",
                origin: ScheduleOrigin.USER,
                playAt: new Date("2100-01-01"),
                recurrenceDelay: null,
                tv: "test"
            });
            await schedule.validate();

            expect(schedule.nbRecurrences).toBeNull();
        });
    });
});
