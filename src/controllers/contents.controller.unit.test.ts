import { ContentType } from "../models";
import { ContentsController } from "./contents.controller";

// tslint:disable: max-line-length
describe("Contents Controller", () => {
    const controller = new ContentsController("");

    describe("Extract YouTube video ID", () => {
        it("Return ID for Youtub URLs", () => {
            expect(controller.extractYoutubeID("https://www.youtube.com/watch?v=HXNhEYqFo0o")).toEqual("HXNhEYqFo0o");
            expect(controller.extractYoutubeID("https://www.youtube.com/watch?v=HXNhEYqFo0o&t=10")).toEqual("HXNhEYqFo0o");
            expect(controller.extractYoutubeID("https://youtu.be/HXNhEYqFo0o")).toEqual("HXNhEYqFo0o");
            expect(controller.extractYoutubeID("https://youtu.be/HXNhEYqFo0o?t=10")).toEqual("HXNhEYqFo0o");
            expect(controller.extractYoutubeID("//www.youtube-nocookie.com/embed/up_lNV-yoK4?rel=0")).toEqual("up_lNV-yoK4");
            expect(controller.extractYoutubeID("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo")).toEqual("1p3vcRhsYGo");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel")).toEqual("cKZDdG9FTKY");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TLvideos=osPknwzXEas&feature=sub")).toEqual("yZ-K7nCVnBI");
            expect(controller.extractYoutubeID("http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I")).toEqual("NRHVzbJVx8I");
            expect(controller.extractYoutubeID("http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/6dwqZw0j_jY")).toEqual("6dwqZw0j_jY");
            expect(controller.extractYoutubeID("http://youtu.be/6dwqZw0j_jY")).toEqual("6dwqZw0j_jY");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=6dwqZw0j_jY&feature=youtu.be")).toEqual("6dwqZw0j_jY");
            expect(controller.extractYoutubeID("http://youtu.be/afa-5HQHiAs")).toEqual("afa-5HQHiAs");
            expect(controller.extractYoutubeID("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo?rel=0")).toEqual("1p3vcRhsYGo");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel")).toEqual("cKZDdG9FTKY");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TLvideos=osPknwzXEas&feature=sub")).toEqual("yZ-K7nCVnBI");
            expect(controller.extractYoutubeID("http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I")).toEqual("NRHVzbJVx8I");
            expect(controller.extractYoutubeID("http://www.youtube.com/embed/nas1rJpm7wY?rel=0")).toEqual("nas1rJpm7wY");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=peFZbP64dsU")).toEqual("peFZbP64dsU");
            expect(controller.extractYoutubeID("http://youtube.com/v/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtube.com/vi/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtube.com/?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtube.com/?vi=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtube.com/watch?vi=dQw4w9WgXcQ&feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
            expect(controller.extractYoutubeID("http://youtu.be/dQw4w9WgXcQ?feature=youtube_gdata_player")).toEqual("dQw4w9WgXcQ");
        });

        it("Return null if other URL", () => {
            expect(controller.extractYoutubeID("https://www.youtube.com/watch?v=")).toBeNull();
            expect(controller.extractYoutubeID("http://google.fr")).toBeNull();
            expect(controller.extractYoutubeID("some text")).toBeNull();
            expect(controller.extractYoutubeID("http://localhost/v?=dQw4w9WgXcQ")).toBeNull();
        });
    });

    describe("Check if URI is an URL", () => {
        it("Should return true if URL", () => {
            expect(controller.isURL("http://localhost/v?=dQw4w9WgXcQ")).toBeTruthy();
            expect(controller.isURL("https://www.youtube.com/watch?v=")).toBeTruthy();
            expect(controller.isURL("http://google.fr")).toBeTruthy();
        });
        it("Should return false if not an URL", () => {
            expect(controller.isURL("some_test")).toBeFalsy();
            expect(controller.isURL("/home/user/videos/test.mp4")).toBeFalsy();
        });
    });

    describe("Infer type", () => {
        it("Should return IMAGE if URI points to an image", () => {
            expect(controller.inferType("http://localhost/test.jpg")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("http://localhost/test.jpeg")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("http://localhost/test.png")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("http://localhost/test.gif")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("http://localhost/test.bmp")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("/home/user/images/test.jpg")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("/home/user/images/test.jpeg")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("/home/user/images/test.png")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("/home/user/images/test.gif")).toEqual(ContentType.IMAGE);
            expect(controller.inferType("/home/user/images/test.bmp")).toEqual(ContentType.IMAGE);
        });

        it("Should return VIDEO if URI points to a video", () => {
            expect(controller.inferType("http://localhost/test.mp4")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("http://localhost/test.webm")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("http://localhost/test.avi")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("http://localhost/test.mkv")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("http://localhost/test.mov")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("http://localhost/test.wmv")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.mp4")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.webm")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.avi")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.mkv")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.mov")).toEqual(ContentType.VIDEO);
            expect(controller.inferType("/home/user/images/test.wmv")).toEqual(ContentType.VIDEO);
        });

        it("Should return WEBPAGE if URI points to a webpage", () => {
            expect(controller.inferType("http://localhost/index.html")).toEqual(ContentType.WEBPAGE);
            expect(controller.inferType("http://localhost/index.php")).toEqual(ContentType.WEBPAGE);
            expect(controller.inferType("/home/user/index.html")).toEqual(ContentType.WEBPAGE);
            expect(controller.inferType("/home/user/index.php")).toEqual(ContentType.WEBPAGE);
            expect(controller.inferType("http://google.fr")).toEqual(ContentType.WEBPAGE);
            expect(controller.inferType("http://localhost/test")).toEqual(ContentType.WEBPAGE);
        });

        it("Should return YOUTUBE is URI points to a YouTube video", () => {
            // This is based on the extractYoutubeID method, so no need to
            // test further
            expect(controller.inferType("https://www.youtube.com/watch?v=HXNhEYqFo0o")).toEqual(ContentType.YOUTUBE);
        });

        it("Should defaults to TEXT for unknown URI", () => {
            expect(controller.inferType("some_text")).toEqual(ContentType.TEXT);
        });
    });

    describe("Prepare URI for display", () => {
        // it("Should wrap IMAGE content", () => {
        //     const content: any = {
        //         type: ContentType.IMAGE,
        //         uri: "http://localhost/image.jpg"
        //     };
        //     const copy = controller.prepareContentForDisplay(content);

        //     expect(copy.uri).not.toEqual(content.uri);
        // });
        // it("Should wrap VIDEO content", () => {
        //     const content: any = {
        //         type: ContentType.VIDEO,
        //         uri: "http://localhost/video.mp4"
        //     };
        //     const copy = controller.prepareContentForDisplay(content);

        //     expect(copy.uri).not.toEqual(content.uri);
        // });
        // it("Should wrap TEXT content", () => {
        //     const content: any = {
        //         type: ContentType.TEXT,
        //         uri: "some text"
        //     };
        //     const copy = controller.prepareContentForDisplay(content);

        //     expect(copy.uri).not.toEqual(content.uri);
        // });
        // it("Should not modify other contents", () => {
        //     let content: any = {
        //         type: ContentType.YOUTUBE,
        //         uri: "http://youtube.fr/watch?v=some_id"
        //     };
        //     let copy = controller.prepareContentForDisplay(content);

        //     expect(copy.uri).toEqual(content.uri);

        //     content = {
        //         type: ContentType.WEBPAGE,
        //         uri: "http://localhost"
        //     };
        //     copy = controller.prepareContentForDisplay(content);

        //     expect(copy.uri).toEqual(content.uri);
        // });
    });
});
