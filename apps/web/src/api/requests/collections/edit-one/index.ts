import { Collection } from "@/entities/collection";
import { useEditCollection } from "./use-mutation";

export namespace EditCollection {
    export const url = (slug: string) => `/collections/${slug}`;
    export const method = "PUT";

    export const useMutation = useEditCollection
    export const body = (body: Body) => body;

    export type MutationInput = Body & {
        slug: string
    };

    export type Body = {
        name?: string;
        description?: string;
        fictions?: string[]
    }

    export type ResponseData = Collection;
}