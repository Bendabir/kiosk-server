import dotenv from "dotenv";

export interface Config {
    // Extracting the env variables and storing the config
    VERSION: string;
    MIN_CLIENT_VERSION: string;
    LOG_LEVEL: string;
    SERVER_HOST: string;
    SERVER_PORT: number;
    SERVER_URL: string;
    UPLOAD_DIR: string;
    MAX_UPLOAD_SIZE: number;

    // For the database
    PG_HOST: string;
    PG_PORT: number;
    PG_USER: string;
    PG_PASS: string ;
    PG_DB: string;

    // Misc configuration
    DEFAULT_IDENTIFY_DURATION: number;
    DEFAULT_BRIGHTNESS: number;
    DEFAULT_VOLUME: number;
    DEFAULT_FORWARD_DURATION: number;
    DEFAULT_REWIND_DURATION: number;

    defaults: () => Defaults;
}

export interface Defaults {
    brightness: number;
    forwardDuration: number;
    identifyDuration: number;
    rewindDuration: number;
    volume: number;
}

class AppConfig implements Config {
    public VERSION: string;
    public MIN_CLIENT_VERSION: string;
    public LOG_LEVEL: string;
    public SERVER_HOST: string;
    public SERVER_PORT: number;
    public SERVER_URL: string;
    public UPLOAD_DIR: string;
    public MAX_UPLOAD_SIZE: number;

    public PG_HOST: string;
    public PG_PORT: number;
    public PG_USER: string;
    public PG_PASS: string ;
    public PG_DB: string;

    public DEFAULT_IDENTIFY_DURATION: number;
    public DEFAULT_BRIGHTNESS: number;
    public DEFAULT_VOLUME: number;
    public DEFAULT_FORWARD_DURATION: number;
    public DEFAULT_REWIND_DURATION: number;

    constructor() {
        // Load the .env file
        dotenv.config();

        // Extracting the env variables and storing the config
        this.VERSION = "3.0.0";
        this.MIN_CLIENT_VERSION = "3.0.0";
        this.LOG_LEVEL = process.env.LOG_LEVEL || "info";
        this.SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";
        this.SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 5000;
        this.SERVER_URL = `http://${this.SERVER_HOST}:${this.SERVER_PORT}`;
        this.UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
        this.MAX_UPLOAD_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 2 * 1024 * 1024;

        // For the database
        this.PG_HOST = process.env.POSTGRES_HOST || "localhost";
        this.PG_PORT = parseInt(process.env.POSTGRES_PORT, 10) || 5432;
        this.PG_USER = process.env.POSTGRES_USER || "postgres";
        this.PG_PASS = process.env.POSTGRES_PASS;
        this.PG_DB = process.env.POSTGRES_DB || "kiosk";

        // Misc configuration
        this.DEFAULT_IDENTIFY_DURATION = Math.max(parseInt(process.env.DEFAULT_IDENTIFY_DURATION, 10), 500) || 5000;
        this.DEFAULT_BRIGHTNESS = Math.min(Math.max(parseFloat(process.env.DEFAULT_BRIGHTNESS), 0.05), 1.0) || 1.0;
        this.DEFAULT_VOLUME = Math.min(Math.max(parseFloat(process.env.DEFAULT_VOLUME), 0.05), 1.0) || 1.0;
        this.DEFAULT_FORWARD_DURATION = Math.max(parseInt(process.env.DEFAULT_FORWARD_DURATION, 10), 0) || 5000;
        this.DEFAULT_REWIND_DURATION = Math.max(parseInt(process.env.DEFAULT_REWIND_DURATION, 10), 0) || 5000;
    }

    public defaults() {
        return {
            brightness: this.DEFAULT_BRIGHTNESS,
            forwardDuration: this.DEFAULT_FORWARD_DURATION,
            identifyDuration: this.DEFAULT_IDENTIFY_DURATION,
            rewindDuration: this.DEFAULT_REWIND_DURATION,
            volume: this.DEFAULT_VOLUME
        };
    }
}

export const config = new AppConfig();
