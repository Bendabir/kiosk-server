import dotenv from "dotenv";

// Load the .env file
dotenv.config();

// Extracting the env variables and storing the config
export const VERSION = "3.0.0";
export const MIN_CLIENT_VERSION = "3.0.0";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
export const SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";
export const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 5000;
export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

// For the database
export const PG_HOST = process.env.POSTGRES_HOST || "localhost";
export const PG_PORT = parseInt(process.env.POSTGRES_PORT, 10) || 5432;
export const PG_USER = process.env.POSTGRES_USER || "postgres";
export const PG_PASS = process.env.POSTGRES_PASS;
export const PG_DB = process.env.POSTGRES_DB || "kiosk";

// Misc configuration
export const DEFAULT_IDENTIFY_DURATION = Math.max(parseInt(process.env.DEFAULT_IDENTIFY_DURATION, 10), 500) || 5000;
export const DEFAULT_BRIGHTNESS = Math.min(Math.max(parseFloat(process.env.DEFAULT_BRIGHTNESS), 0.05), 1.0) || 1.0;
export const DEFAULT_VOLUME = Math.min(Math.max(parseFloat(process.env.DEFAULT_VOLUME), 0.05), 1.0) || 1.0;
export const DEFAULT_FORWARD_DURATION = Math.max(parseInt(process.env.DEFAULT_FORWARD_DURATION, 10), 0) || 5000;
export const DEFAULT_REWIND_DURATION = Math.max(parseInt(process.env.DEFAULT_REWIND_DURATION, 10), 0) || 5000;
