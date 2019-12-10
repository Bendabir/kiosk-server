import dotenv from "dotenv";

// Load the .env file
dotenv.config();

// Extracting the env variables and storing the config
export const VERSION = "3.0.0-alpha";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
export const PORT = parseInt(process.env.PORT, 10) || 5000;
