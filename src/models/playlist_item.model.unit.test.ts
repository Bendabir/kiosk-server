import { ValidationError } from "sequelize";
import { PlaylistItem } from "./playlist_item.model";

describe("Playlist Item Model", () => {
    describe("Create Playlist Item", () => {
        it("Index cannot be null", () => {
            expect(PlaylistItem.build({
                content: "test",
                index: null,
                playlist: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Index must be greater than 0", () => {
            expect(PlaylistItem.build({
                content: "test",
                index: -1,
                playlist: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Index must default to 0", async () => {
            const item = PlaylistItem.build({
                content: "test",
                playlist: "test"
            });
            await item.validate();

            expect(item.index).toEqual(0);
        });

        it("Now playing status cannot be null", () => {
            expect(PlaylistItem.build({
                content: "test",
                nowPlaying: null,
                playlist: "test"
            }).validate()).rejects.toThrowError(ValidationError);
        });
        it("Now playing status must default to false", async () => {
            const item = PlaylistItem.build({
                content: "test",
                playlist: "test"
            });
            await item.validate();

            expect(item.nowPlaying).toBeFalsy();
        });
    });
});
