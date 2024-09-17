import { Serial } from "@/entities/serial";
import { Season } from "@/entities/serial/season";
import { QueryKey } from "@tanstack/react-query";


export namespace GetSeason {
    export type Relation = 'episodes' | 'serial'
    export type QueryParams = Partial<{
        expand: boolean;
        relations: Relation[]
    }>;
    export type ResponseData = Season;

    export const queryKey = (imdbid: string, season: number | string, queryParams?: QueryParams) => {
        const queryKey: string[] = [`client/serials/${imdbid}/${season}`]

        if (queryParams?.expand) {
            queryKey.push('expand')
        }

        if (queryParams?.relations) {
            queryKey.push(`relations/${queryParams.relations.join(',')}`)
        }

        return queryKey as QueryKey;
    }

    export const queryParams = (queryParams: QueryParams) => {
        const queryParamsStrings: Partial<Record<keyof QueryParams, string>> = {
           
        }

        if (queryParams.expand) {
            queryParamsStrings.expand = 'true'
        }

        if (queryParams.relations) {
            queryParamsStrings.relations = queryParams.relations.join(',')
        }

        return queryParamsStrings;
    }

    export const url = (imdbid: string, season: number | string) => (
        `/serials/${imdbid}/${season}`
    )
}