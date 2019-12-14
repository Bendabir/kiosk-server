import { Sequelize } from "sequelize";
import * as config from "./config";
import { logger } from "./logging";

const uri = `postgres://${config.PG_USER}:${config.PG_PASS}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}`;
export const sequelize = new Sequelize(uri, {
    logging: (msg) => logger.silly(msg),
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
});
