import { ValidationError } from "sequelize";
import { Group } from "./group.model";

describe("Group Model", () => {
    describe("Create Group", () => {
        it("ID cannot be null", () => {
            expect(Group.build({
                id: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("ID must have length between 1 and 32", async () => {
            expect(Group.build({
                id: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Group.build({
                id: "azertyuiopqsdfghjklmwxcvbn0123456"
            }).validate()).rejects.toThrowError(ValidationError);

            Group.build({
                id: "a"
            }).validate();

            Group.build({
                id: "azertyuiopqsdfghjklmwxcvbn012345"
            }).validate();
        });
        it("ID must be alphanumeric", async () => {
            await Group.build({
                id: "a_B-0"
            }).validate();
        });

        it("Display name can be null", async () => {
            await Group.build({
                displayName: null,
                id: "test"
            }).validate();
        });
        it("Display name must have length between 1 and 64", async () => {
            expect(Group.build({
                displayName: "",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Group.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn012345",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Group.build({
                displayName: "a",
                id: "test"
            }).validate();

            await Group.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn01234",
                id: "test"
            }).validate();
        });
        it("Display name must default to ID", async () => {
            const id = "test";
            let group = Group.build({
                id
            });
            await group.validate();

            expect(group.displayName).toEqual(id);

            group = Group.build({
                displayName: null,
                id
            });
            await group.validate();

            expect(group.displayName).toEqual(id);
        });

        it("Description can be null", async () => {
            await Group.build({
                description: null,
                id: "test"
            }).validate();
        });
        it("Description cannot be an empty string", () => {
            expect(Group.build({
                description: "",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Description must default to null", async () => {
            const group = Group.build({
                id: "test"
            });
            await group.validate();

            expect(group.description).toBeNull();
        });

        it("Active status cannot be null", () => {
            expect(Group.build({
                active: null,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Active status must default to true", async () => {
            const group = Group.build({
                id: "test"
            });
            await group.validate();

            expect(group.active).toBeTruthy();
        });
    });
});
