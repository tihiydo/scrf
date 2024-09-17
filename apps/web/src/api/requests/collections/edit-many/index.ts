import { Collection } from "@/entities/collection";
import { useEditCollections } from "./use-mutation";

export namespace EditManyCollections {
    export const url = '/collections'
    export const method = 'PUT';

    export const body = (body: Body) => body;
    export const useMutation = useEditCollections

    export type ResponseData = Collection[]
    export type MutationInput = Body;
    export type Body = {
        collections: string[]
    }
}