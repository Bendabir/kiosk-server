import { ContentType } from "../models";
import { ContentsController } from "./contents.controller";

// tslint:disable: max-line-length
describe("Contents Controller", () => {
    describe("Extract YouTube video ID", () => {
        it("Return ID for Youtub URLs", () => {
            expect(ContentsController.extractYoutubeID("https://www.youtube.com/watch?v=HXNhEYqFo0o")).toEqual("HXNhEYqFo0o");
            expect(ContentsController.extractYoutubeID("https://www.youtube.com/watch?v=HXNhEYqFo0o&t=10")).toEqual("HXNhEYqFo0o");
            expect(ContentsController.extractYoutubeID("https://youtu.be/HXNhEYqFo0o")).toEqual("HXNhEYqFo0o");
            expect(ContentsController.extractYoutubeID("https://youtu.be/HXNhEYqFo0o?t=10")).toEqual("HXNhEYqFo0o");
            expect(ContentsController.extractYoutubeID("//www.youtube-nocookie.com/embed/up_lNV-yoK4?rel=0")).toEqual("up_lNV-yoK4");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo")).toEqual("1p3vcRhsYGo");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel")).toEqual("cKZDdG9FTKY");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TLvideos=osPknwzXEas&feature=sub")).toEqual("yZ-K7nCVnBI");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I")).toEqual("NRHVzbJVx8I");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/6dwqZw0j_jY")).toEqual("6dwqZw0j_jY");
            expect(ContentsController.extractYoutubeID("http://youtu.be/6dwqZw0j_jY")).toEqual("6dwqZw0j_jY");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=6dwqZw0j_jY&feature=youtu.be")).toEqual("6dwqZw0j_jY");
            expect(ContentsController.extractYoutubeID("http://youtu.be/afa-5HQHiAs")).toEqual("afa-5HQHiAs");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo?rel=0")).toEqual("1p3vcRhsYGo");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel")).toEqual("cKZDdG9FTKY");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TLvideos=osPknwzXEas&feature=sub")).toEqual("yZ-K7nCVnBI");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I")).toEqual("NRHVzbJVx8I");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/embed/nas1rJpm7wY?rel=0")).toEqual("nas1rJpm7wY");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=peFZbP64dsU")).toEqual("peFZbP64dsU");
            expect(ContentsController.extractYoutubeID("http://youtube.com/v/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtube.com/vi/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtube.com/?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtube.com/?vi=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtube.com/watch?vi=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(ContentsController.extractYoutubeID("http://youtu.be/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
        });

        it("Return null if other URL", () => {
            expect(ContentsController.extractYoutubeID("https://www.youtube.com/watch?v=")).toBeNull();
            expect(ContentsController.extractYoutubeID("http://google.fr")).toBeNull();
            expect(ContentsController.extractYoutubeID("some text")).toBeNull();
            expect(ContentsController.extractYoutubeID("http://localhost/v?=dQw4w9WgXcQ")).toBeNull();
        });
    });

    describe("Check if URI is an URL", () => {
        it("Should return true if URL", () => {
            expect(ContentsController.isURL("http://localhost/v?=dQw4w9WgXcQ")).toBeTruthy();
            expect(ContentsController.isURL("https://www.youtube.com/watch?v=")).toBeTruthy();
            expect(ContentsController.isURL("http://google.fr")).toBeTruthy();
        });
        it("Should return false if not an URL", () => {
            expect(ContentsController.isURL("some_test")).toBeFalsy();
            expect(ContentsController.isURL("/home/user/videos/test.mp4")).toBeFalsy();
        });
    });

    describe("Infer type", () => {
        it("Should return IMAGE if URI points to an image", () => {
            expect(ContentsController.inferType("http://localhost/test.jpg")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("http://localhost/test.jpeg")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("http://localhost/test.png")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("http://localhost/test.gif")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("http://localhost/test.bmp")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("/home/user/images/test.jpg")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("/home/user/images/test.jpeg")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("/home/user/images/test.png")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("/home/user/images/test.gif")).toEqual(ContentType.IMAGE);
            expect(ContentsController.inferType("/home/user/images/test.bmp")).toEqual(ContentType.IMAGE);
        });

        it("Should return VIDEO if URI points to a video", () => {
            expect(ContentsController.inferType("http://localhost/test.mp4")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("http://localhost/test.webm")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("http://localhost/test.avi")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("http://localhost/test.mkv")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("http://localhost/test.mov")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("http://localhost/test.wmv")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.mp4")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.webm")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.avi")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.mkv")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.mov")).toEqual(ContentType.VIDEO);
            expect(ContentsController.inferType("/home/user/images/test.wmv")).toEqual(ContentType.VIDEO);
        });

        it("Should return WEBPAGE if URI points to a webpage", () => {
            expect(ContentsController.inferType("http://localhost/index.html")).toEqual(ContentType.WEBPAGE);
            expect(ContentsController.inferType("http://localhost/index.php")).toEqual(ContentType.WEBPAGE);
            expect(ContentsController.inferType("/home/user/index.html")).toEqual(ContentType.WEBPAGE);
            expect(ContentsController.inferType("/home/user/index.php")).toEqual(ContentType.WEBPAGE);
            expect(ContentsController.inferType("http://google.fr")).toEqual(ContentType.WEBPAGE);
            expect(ContentsController.inferType("http://localhost/test")).toEqual(ContentType.WEBPAGE);
        });

        it("Should return YOUTUBE is URI points to a YouTube video", () => {
            // This is based on the extractYoutubeID method, so no need to
            // test further
            expect(ContentsController.inferType("https://www.youtube.com/watch?v=HXNhEYqFo0o")).toEqual(ContentType.YOUTUBE);
        });

        it("Should defaults to TEXT for unknown URI", () => {
            expect(ContentsController.inferType("some_text")).toEqual(ContentType.TEXT);
        });
    });
});
