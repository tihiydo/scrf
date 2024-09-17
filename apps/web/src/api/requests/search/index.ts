import { MinimalMovie } from "@/entities/movie";
import { MinimalSerial } from "@/entities/serial";
import { QueryKey } from "@tanstack/react-query";
import { useSearch } from "./use-query";
import { Fiction } from "@/entities/fiction";

export namespace GlobalSearch {
    export const url = '/search'
    export const method = 'GET';

    export type QueryParams = Partial<{
        searchStr: string;
        entities: Array<'movie' | 'serial' | 'fiction'>;
    }>

    export const queryKey = (params?: QueryParams): QueryKey => {
        return ['search/global', params]
    }
    export const queryParams = (params?: QueryParams): Partial<Record<keyof QueryParams, string>> => {
        const stringParams: Partial<Record<keyof QueryParams, string>> = {
            searchStr: params?.searchStr
        }

        if (params?.entities?.length) {
            stringParams.entities = Array.from(new Set(params.entities)).join(',')
        }

        return stringParams;
    };

    export const useQuery = useSearch

    export type ResponseData = {
        movies?: MinimalMovie[];
        serials?: MinimalSerial[];
        fictions?: Fiction[];
    }
}