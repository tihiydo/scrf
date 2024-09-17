import { Episode } from "@/entities/serial/episode";
import { QueryKey } from "@tanstack/react-query";
import { getServerEpisode } from "./server";
import { useEpisode } from "./use-episode";

export namespace GetEpisode {
    type Relation = 'serial' | 'season'
    export type UrlParams = { serial: string, season: string | number, episode: string | number }

    export type QueryParams = Partial<{
        expand: boolean;
        relations: Relation[]
    }>

    export const url = (params: UrlParams) => {
        return `/serials/${params.serial}/${params.season}/${params.episode}`
    }

    export const params = (params?: QueryParams) => {
        const stringParams: Partial<Record<keyof QueryParams, string>> = {}

        if (params?.expand) {
            stringParams.expand = '1'
        }

        if (params?.relations) {
            stringParams.relations = params.relations.join(',')
        }

        return stringParams;
    }

    export const queryKey = (urlParams: UrlParams, queryParams: QueryParams) => {
        const queryKey: QueryKey = [`client/episode`, urlParams, queryParams];

        return queryKey;
    }

    export const serverFetch = getServerEpisode;
    export const useQuery = useEpisode;

    export type ResponseData = Episode;
}

