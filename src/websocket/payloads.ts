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
