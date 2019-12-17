import { Model } from "sequelize";

/** Fix associations on a model to avoid having both the foreign key
 *  and the associated object.
 *
 *  Associated objects must be referenced with a capitalized key.
 *
 * @param instance Model instance to normalize.
 *
 */
export const fixAssociations = (instance: Model) => {
    const values: any = instance.get({
        plain: true
    });

    for (const key of Object.keys(values)) {
        if (key[0].toUpperCase() === key[0]) {
            values[key.toLowerCase()] = (values[key] instanceof Model) ? fixAssociations(values[key]) : values[key];
            delete values[key];
        }
    }

    return values;
};
