import dotenv from "dotenv";

// Load the .env file
dotenv.config();

// Extracting the env variables and storing the config
export const VERSION = "3.0.0";
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
