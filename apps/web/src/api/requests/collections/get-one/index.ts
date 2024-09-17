import { Collection } from "@/entities/collection";
import { QueryKey } from "@tanstack/react-query";
import { getServerOneCollection } from "./server";
import { useCollection } from "./use-query";


export namespace GetOneCollection {
    export const url = (slug: string) => `/collections/${slug}`
    export const method = 'GET';

    export type QueryParams = Partial<{
        limit: number;
        page: number;
    }>

    export const queryKey = (slug: string, params?: QueryParams): QueryKey => {
        return ['collections/one', slug, params]
    }
    export const queryParams = (params?: QueryParams) => params;

    export const useQuery = useCollection
    export const serverFetch = getServerOneCollection

    export type ResponseData = {
        total: number;
        collection: Collection;
    }
}