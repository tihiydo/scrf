import { z } from "zod";
const PageSchema = z.number().default(1);

export const FiltersSchema = {
    page: PageSchema,
}
export type Filters = {
    [K in keyof typeof FiltersSchema]?: z.infer<typeof FiltersSchema[K]>
};

