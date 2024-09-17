import { Collection } from "@/entities/collection";
import { useCreateCollection } from "./use-mutation";

export namespace CreateCollection {
    export const url = `/collections`
    export const method = "POST";



    export const useMutation = useCreateCollection
    export const body = (body: Body) => body;

    export type MutationInput = Body;

    export type Body = {
        name: string;
        description?: string;
        fictions?: string[]
    }

    export type ResponseData = Collection;
}