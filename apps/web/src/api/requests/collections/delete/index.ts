import { useDeleteCollection } from "./use-mutation";

export namespace DeleteCollection {
    export const url = (slug: string) => `/collections/${slug}`
    export const method = "DELETE";

    export const useMutation = useDeleteCollection

    export type MutationInput = {
        slug: string;
    }
}