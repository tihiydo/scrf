

import { MinimalSerial } from "@/entities/serial";
import { useSerialsLibrary } from "./use-serials-library";
import { getServerSerials } from "./server";
import { QueryKey } from "@tanstack/react-query";
import { Studio } from "@/entities/studio";


export namespace SerialsLibrary {
    export const useQuery = useSerialsLibrary;
    export const serverFetch = getServerSerials;

    export type QueryParams = Partial<{
        sortBy: ExtendString<'imdb_rating' | 'by_popularity' | 'by_novelty'>;
        releaseYear: number | string;
        endYear: number | string;
        rating: number | string;
        genre: string;
        page: number | string;
        take: number | string;
        audio: string;
        subtitles: string;
        studio: string;
    }>;

    export const method = 'GET'
    export const url = '/serials/library'

    export const queryParams = (params?: QueryParams) => {
        return params
    }

    export const queryKey = (params?: QueryParams) => {
        const queryKey: QueryKey = ['client/serials/library', params];

        return queryKey;
    }

    export type ResponseData = {
        serials: MinimalSerial[],
        studios: Studio[];
        total: number;
    }
}