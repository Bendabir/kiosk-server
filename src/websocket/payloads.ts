// tslint:disable-next-line:no-empty-interface
export interface Payload {}

export interface RegisterPlayload extends Payload {
    id: string;
    screenSize: string;
    machine: string;
    version: string;
}
