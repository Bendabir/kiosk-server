import * as config from "./config";
import { sequelize } from "./connections/database";
import { logger } from "./logging";

logger.info("_   ___           _     ");
logger.info("| | / (_)         | |   ");
logger.info("| |/ / _  ___  ___| | __");
logger.info("|    \\| |/ _ \\/ __| |/ /");
logger.info("| |\\  \\ | (_) \\__ \\   < ");
logger.info("\\_| \\_/_|\\___/|___/_|\\_\\ Server " + config.VERSION);
logger.info("");
logger.info("Contribute : https://github.com/bendabir/kiosk-server");
logger.info("");
logger.info("Using the following configuration :");
logger.info("    LOG_LEVEL     = " + config.LOG_LEVEL);
logger.info("    SERVER_HOST   = " + config.SERVER_HOST);
logger.info("    SERVER_PORT   = " + config.SERVER_PORT);
logger.info("    POSTGRES_HOST = " + config.PG_HOST);
logger.info("    POSTGRES_PORT = " + config.PG_PORT);
logger.info("    POSTGRES_USER = " + config.PG_USER);
logger.info("    POSTGRES_DB   = " + config.PG_DB);

sequelize.authenticate().then(() => {
    logger.info("Connection to database successful !");
}).catch((error) => {
    logger.error("Error connecting to database : " + error.message);
    process.exit(1);
});
