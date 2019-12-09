import dotenv from "dotenv";

// Load the .env file
dotenv.config();

// Extracting the env variables and storing the config
export const PORT = parseInt(process.env.PORT, 10) || 5000;
