import { Collection } from "@/entities/collection";
import { QueryKey } from "@tanstack/react-query";
import { getServerManyCollections } from "./server";
import { useCollections } from "./use-query";


export namespace GetManyCollections {
    export const url = '/collections'
    export const method = 'GET';

    export type QueryParams = Partial<{
        limit: number;
        page: number;
    }>

    export const queryKey= (params?: QueryParams): QueryKey => {
        return ['collections/many', params]
    }
    export const queryParams = (params?: QueryParams) => params;

    export const serverFetch = getServerManyCollections
    export const useQuery = useCollections

    export type ResponseData = {
        total: number;
        collections: Collection[];
    }
}