import { App } from "./app";
import { config } from "./config";
import { sequelize } from "./database";
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
logger.info(`    LOG_LEVEL                 = ${config.LOG_LEVEL}`);
logger.info(`    SERVER_HOST               = ${config.SERVER_HOST}`);
logger.info(`    SERVER_PORT               = ${config.SERVER_PORT}`);
logger.info(`    UPLOAD_DIR                = ${config.UPLOAD_DIR}`);
logger.info(`    MAX_UPLOAD_SIZE           = ${config.MAX_UPLOAD_SIZE}`);
logger.info(`    POSTGRES_HOST             = ${config.PG_HOST}`);
logger.info(`    POSTGRES_PORT             = ${config.PG_PORT}`);
logger.info(`    POSTGRES_USER             = ${config.PG_USER}`);
logger.info(`    POSTGRES_DB               = ${config.PG_DB}`);
logger.info(`    DEFAULT_IDENTIFY_DURATION = ${config.DEFAULT_IDENTIFY_DURATION}`);
logger.info(`    DEFAULT_BRIGHTNESS        = ${config.DEFAULT_BRIGHTNESS}`);
logger.info(`    DEFAULT_VOLUME            = ${config.DEFAULT_VOLUME}`);
logger.info(`    DEFAULT_FORWARD_DURATION  = ${config.DEFAULT_FORWARD_DURATION}`);
logger.info(`    DEFAULT_REWIND_DURATION   = ${config.DEFAULT_REWIND_DURATION}`);
logger.info("");
logger.info("");

const app = new App(config, sequelize);

app.run();
