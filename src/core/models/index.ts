import { sequelize } from "../../connections/database";
import { Group } from "./group";

sequelize.sync(); // We should move to migrations at some point

// Reworking exports a bit
export { Group };
