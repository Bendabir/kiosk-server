import { ValidationError } from "sequelize";
import { TV } from "./tv.model";

describe("TV Model", () => {
    describe("Create TV", () => {
        it("ID cannot be null", () => {
            expect(TV.build({
                id: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("ID must have length between 1 and 32", async () => {
            expect(TV.build({
                id: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "azertyuiopqsdfghjklmwxcvbn0123456"
            }).validate()).rejects.toThrowError(ValidationError);

            TV.build({
                id: "a"
            }).validate();

            TV.build({
                id: "azertyuiopqsdfghjklmwxcvbn012345"
            }).validate();
        });
        it("ID must be alphanumeric", async () => {
            await TV.build({
                id: "a_B-0"
            }).validate();
        });

        it("Display name can be null", async () => {
            await TV.build({
                displayName: null,
                id: "test"
            }).validate();
        });
        it("Display name must have length between 1 and 64", async () => {
            expect(TV.build({
                displayName: "",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn012345",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await TV.build({
                displayName: "a",
                id: "test"
            }).validate();

            await TV.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn01234",
                id: "test"
            }).validate();
        });
        it("Display name must default to ID", async () => {
            const id = "test";
            let tv = TV.build({
                id
            });
            await tv.validate();

            expect(tv.displayName).toEqual(id);

            tv = TV.build({
                displayName: null,
                id
            });
            await tv.validate();

            expect(tv.displayName).toEqual(id);
        });

        it("Description can be null", async () => {
            await TV.build({
                description: null,
                id: "test"
            }).validate();
        });
        it("Description cannot be an empty string", () => {
            expect(TV.build({
                description: "",
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Description must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.description).toBeNull();
        });

        it("Active status cannot be null", () => {
            expect(TV.build({
                active: null,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Active status must default to true", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.active).toBeTruthy();
        });

        it("ON status cannot be null", () => {
            expect(TV.build({
                id: "test",
                on: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("ON status must default to false", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.on).toBeFalsy();
        });

        it("Screen size can be null", async () => {
            await TV.build({
                id: "test",
                screenSize: null
            }).validate();
        });
        it("Screen size must have a length between 7 and 11", async () => {
            expect(TV.build({
                id: "test",
                screenSize: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                screenSize: "99x99"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                screenSize: "12345x678900"
            }).validate()).rejects.toThrowError(ValidationError);

            await TV.build({
                id: "test",
                screenSize: "999x999"
            }).validate();

            await TV.build({
                id: "test",
                screenSize: "12345x67890"
            }).validate();
        });
        it("Screen size must be of format <width>x<height>", async () => {
            let size = "1920x1080";
            let tv = TV.build({
                id: "test",
                screenSize: size
            });
            await tv.validate();

            expect(tv.screenSize).toEqual(size);

            size = "1920X1080";
            tv = TV.build({
                id: "test",
                screenSize: size
            });
            await tv.validate();

            expect(tv.screenSize).toEqual(size.toLowerCase());
        });
        it("Screen size must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.screenSize).toBeNull();
        });

        it("Machine can be null", async () => {
            await TV.build({
                id: "test",
                machine: null
            }).validate();
        });
        it("Machine cannot be an empty string", () => {
            expect(TV.build({
                id: "test",
                machine: ""
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Machine must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.machine).toBeNull();
        });

        it("IP can be null", async () => {
            await TV.build({
                id: "test",
                ip: null
            }).validate();
        });
        it("IP must be of format 'www.xxx.yyy.zzz'", async () => {
            expect(TV.build({
                id: "test",
                ip: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                ip: "127.0.1"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                ip: "127.0.0.0.1"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                ip: "512.512.512.512"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                ip: "1270.0.0.1"
            }).validate()).rejects.toThrowError(ValidationError);

            await TV.build({
                id: "test",
                ip: "127.0.0.1"
            }).validate();

            await TV.build({
                id: "test",
                ip: "255.255.255.255"
            }).validate();
        });
        it("IP must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.ip).toBeNull();
        });

        it("Version can be null", async () => {
            await TV.build({
                id: "test",
                version: null
            }).validate();
        });
        it("Version must be of format 'xx.yy.zz'", async () => {
            expect(TV.build({
                id: "test",
                version: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                version: "100.0.1"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                version: "1.0.0.0.1"
            }).validate()).rejects.toThrowError(ValidationError);

            await TV.build({
                id: "test",
                version: "3.0.0"
            }).validate();

            await TV.build({
                id: "test",
                version: "3.0.10"
            }).validate();
        });
        it("IP must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.ip).toBeNull();
        });
    });
});
