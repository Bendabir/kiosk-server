import { Sequelize } from "sequelize";
import { config } from "./config";
import { logger } from "./logging";

const DB_URI = `postgres://${config.PG_USER}:${config.PG_PASS}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}`;

export const sequelize = new Sequelize(DB_URI, {
    logging: (msg) => logger.silly(msg),
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
});
