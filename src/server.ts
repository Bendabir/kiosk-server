import * as config from "./config";
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
logger.info("    LOG_LEVEL = " + config.LOG_LEVEL);
logger.info("    PORT      = " + config.PORT);
