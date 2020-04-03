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

        it("Display name must have length between 1 and 64", async () => {
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

            tv = TV.build({
                displayName: "",
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
        it("Empty description must be set to null", async () => {
            const tv = TV.build({
                description: "",
                id: "test"
            });
            await tv.validate();

            expect(tv.description).toBeNull();
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
        it("Empty screen size must be set to null", async () => {
            const tv = TV.build({
                id: "test",
                screenSize: ""
            });
            await tv.validate();

            expect(tv.screenSize).toBeNull();
        });
        it("Screen size must have a length between 7 and 11", async () => {

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
        it("Empty machine must be set to null", async () => {
            const tv = TV.build({
                id: "test",
                machine: ""
            });
            await tv.validate();

            expect(tv.machine).toBeNull();
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
        it("Empty ID must be set to null", async () => {
            const tv = TV.build({
                id: "test",
                ip: ""
            });
            await tv.validate();

            expect(tv.ip).toBeNull();
        });
        it("IP must be of format 'www.xxx.yyy.zzz'", async () => {
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
        it("Empty version must be set to null", async () => {
            const tv = TV.build({
                id: "test",
                version: ""
            });
            await tv.validate();

            expect(tv.version).toBeNull();
        });
        it("Version must be of format 'xx.yy.zz'", async () => {
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
        it("Version must default to null", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.version).toBeNull();
        });

        it("Brightness cannot be null", () => {
            expect(TV.build({
                brightness: null,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Brightness must default to 1.0", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.brightness).toBe(1.0);
        });
        it("Brightness must be between 0.05 and 1.0", () => {
            expect(TV.build({
                brightness: 0,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                brightness: -0.1,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                brightness: 1.5,
                id: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });

        it("Muted status cannot be null", () => {
            expect(TV.build({
                id: "test",
                muted: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Muted status must default to true", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.muted).toBeTruthy();
        });

        it("Volume cannot be null", () => {
            expect(TV.build({
                id: "test",
                volume: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Volume must default to 1.0", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.volume).toBe(1.0);
        });
        it("Volume must be between 0.0 and 1.0", () => {
            expect(TV.build({
                id: "test",
                volume: -0.1
            }).validate()).rejects.toThrowError(ValidationError);

            expect(TV.build({
                id: "test",
                volume: 1.5
            }).validate()).rejects.toThrowError(ValidationError);
        });

        it("Show title status cannot be null", () => {
            expect(TV.build({
                id: "test",
                showTitle: null
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Show title status must default to true", async () => {
            const tv = TV.build({
                id: "test"
            });
            await tv.validate();

            expect(tv.showTitle).toBeFalsy();
        });
    });
});
