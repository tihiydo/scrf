import { z } from "zod";
const PageSchema = z.number().default(1);

export const CollectionQueryParamsSchema = {
    page: PageSchema,
}
export type CollectionQueryParams = {
    [K in keyof typeof CollectionQueryParamsSchema]?: z.infer<typeof CollectionQueryParamsSchema[K]>
};

