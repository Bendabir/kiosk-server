import { Sequelize } from "sequelize";

import * as config from "../config";
import { logger } from "../logging";

const uri = `postgres://${config.PG_USER}:${config.PG_PASS}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}`;
const sequelize = new Sequelize(uri, {
    logging: (msg) => logger.debug(msg),
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
});

sequelize.authenticate().then(() => {
    logger.info("Connection to database successful !");
}).catch((error) => {
    logger.error("Error connecting to database : " + error.message);
    process.exit(1);
});

export { sequelize };
