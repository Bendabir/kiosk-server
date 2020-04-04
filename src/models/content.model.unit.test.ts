import { ValidationError } from "sequelize";
import { Content, ContentType } from "./content.model";

describe("Content Model", () => {
    describe("Create Content", () => {
        it("ID cannot be null", () => {
            expect(Content.build({
                id: null,
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("ID must have length between 1 and 32", async () => {
            expect(Content.build({
                id: "",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Content.build({
                id: "azertyuiopqsdfghjklmwxcvbn0123456",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            Content.build({
                id: "a",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();

            Content.build({
                id: "azertyuiopqsdfghjklmwxcvbn012345",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("ID must be alphanumeric", async () => {
            await Content.build({
                id: "a_B-0",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });

        it("Display name must have length between 1 and 64", async () => {
            expect(Content.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn012345",
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Content.build({
                displayName: "a",
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();

            await Content.build({
                displayName: "azertyuiopqsdfghjklmwxcvbn0123456azertyuiopqsdfghjklmwxcvbn01234",
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Display name must default to ID", async () => {
            const id = "test";
            let content = Content.build({
                id,
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.displayName).toEqual(id);

            content = Content.build({
                displayName: null,
                id,
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.displayName).toEqual(id);

            content = Content.build({
                displayName: "",
                id,
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.displayName).toEqual(id);
        });

        it("Description can be null", async () => {
            await Content.build({
                description: null,
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Empty description must be set to null", async () => {
            const content = Content.build({
                description: "",
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.description).toBeNull();
        });
        it("Description must default to null", async () => {
            const content = Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.description).toBeNull();
        });

        it("Type cannot be null", () => {
            expect(Content.build({
                id: "test",
                type: null,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });

        it("URI must have length between 1 and 256", async () => {
            expect(Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: ""
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "a".repeat(257)
            }).validate()).rejects.toThrowError(ValidationError);

            await Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "a"
            }).validate();

            await Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "a".repeat(256)
            }).validate();
        });
        it("URI must be null if content is a playlist", async () => {
            expect(Content.build({
                id: "test",
                type: ContentType.PLAYLIST,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Content.build({
                id: "test",
                type: ContentType.PLAYLIST,
                uri: null
            }).validate();
        });
        it("URI cannot be null if content is not a playlist", async () => {
            for (const type in ContentType) {
                if (type !== ContentType.PLAYLIST) {
                    expect(Content.build({
                        id: "test",
                        type,
                        uri: null
                    }).validate()).rejects.toThrowError(ValidationError);

                    await Content.build({
                        id: "test",
                        type,
                        uri: "test"
                    }).validate();
                }
            }
        });

        it("Thumbnail can be null", async () => {
            await Content.build({
                id: "test",
                thumbnail: null,
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Empty thumbnail must be set to null", async () => {
            const content = Content.build({
                id: "test",
                thumbnail: "",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.thumbnail).toBeNull();
        });
        it("Thumbnail must default to null", async () => {
            const content = Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.thumbnail).toBeNull();
        });

        it("Duration can be null", async () => {
            await Content.build({
                duration: null,
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Duration must be greater than 1", async () => {
            expect(Content.build({
                duration: -1,
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            expect(Content.build({
                duration: 0,
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            await Content.build({
                duration: 1,
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Duration must default to null", async () => {
            const content = Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.duration).toBeNull();
        });

        it("MIME type name can be null", async () => {
            await Content.build({
                id: "test",
                mimeType: null,
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("Empty MIME type must be set to null", async () => {
            const content = Content.build({
                id: "test",
                mimeType: "",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.mimeType).toBeNull();
        });
        it("MIME type name must have length between 1 and 32", async () => {
            expect(Content.build({
                id: "test",
                mimeType: "azertyuiopqsdfghjklmwxcvbn0123456",
                type: ContentType.TEXT,
                uri: "test"
            }).validate()).rejects.toThrowError(ValidationError);

            Content.build({
                id: "test",
                mimeType: "a",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();

            Content.build({
                id: "test",
                mimeType: "azertyuiopqsdfghjklmwxcvbn012345",
                type: ContentType.TEXT,
                uri: "test"
            }).validate();
        });
        it("MIME type must default to null", async () => {
            const content = Content.build({
                id: "test",
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.mimeType).toBeNull();
        });
        it("MIME type must lowercase", async () => {
            const mimeType = "IMAGE/JPEG";
            const content = Content.build({
                id: "test",
                mimeType,
                type: ContentType.TEXT,
                uri: "test"
            });
            await content.validate();

            expect(content.mimeType).toEqual(mimeType.toLowerCase());
        });
    });
});
