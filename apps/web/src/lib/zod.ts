import { z } from "zod";

export const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
    // make sure schema is not null or undefined
    if (schema === null || schema === undefined) return [];
    // check if schema is nullable or optional
    if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) return zodKeys(schema.unwrap());
    // check if schema is an array
    if (schema instanceof z.ZodArray) return zodKeys(schema.element);
    // check if schema is an object
    if (schema instanceof z.ZodObject) {
        // get key/value pairs from schema
        const entries = Object.entries(schema.shape);
        // loop through key/value pairs
        return entries.flatMap(([key, value]) => {
            // get nested keys
            const nested = value instanceof z.ZodType ? zodKeys(value).map(subKey => `${key}.${subKey}`) : [];
            // return nested keys
            return nested.length ? nested : key;
        });
    }
    // return empty array
    return [];
};

// This validator removes fields with an error
// It ignores fields that are not in schema
export const excludingValidator = <T extends z.ZodSchema>(schema: T) => (data: z.infer<T>) => {
    const response = schema.safeParse(data);

    if (response.success === false) {
        const errorPaths = response.error.issues.map((issue) => issue.path);

        let filteredData = data;
        errorPaths.forEach(
            (error) => (filteredData = filterByPath(filteredData, error))
        );

        return filteredData;
    }

    return data;
};

// if error happened => set undefined instead of that data
function filterByPath(filteredData: object, error: (string | number)[]): object {
    const dataCopy = {...filteredData}
    const errorKey = error[0];

    // Delete property with error
    // @ts-ignore
    dataCopy[errorKey] = undefined

    return dataCopy;
}