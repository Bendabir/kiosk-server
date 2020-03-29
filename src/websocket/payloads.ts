import { ContentType } from "../models";

// tslint:disable-next-line:no-empty-interface
export interface Payload {}

export interface RegisterPayload extends Payload {
    id: string;
    screenSize: string;
    machine: string;
    version: string;
}

export interface IdentifyPayload extends Payload {
    duration: number;
}

// Define some payload structures for data we send
export class ContentPayloadData {
    public id: string;
    public displayName: string;
    public description: string;
    public type: ContentType;
    public uri: string;
}

export class DisplayPlayload implements Payload {
    public content: {
        [key: string]: ContentPayloadData
    };
}

export class TVPayloadData {
    public id: string;
    public displayName: string;
    public brightness: number;
}

export class InitPayload extends DisplayPlayload {
    public tv: {
        [key: string]: TVPayloadData
    };
}
