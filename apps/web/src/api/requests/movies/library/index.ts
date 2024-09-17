


import { QueryKey } from "@tanstack/react-query";
import { getServerMovies } from "./server";
import { MinimalMovie } from "@/entities/movie";
import { Studio } from "@/entities/studio";
import { useMovies } from "./use-query";


export namespace MoviesLibrary {
    export const serverFetch = getServerMovies;
    export const useQuery = useMovies

    export type QueryParams = Partial<{
        sortBy: ExtendString<'imdb_rating' | 'by_popularity' | 'by_novelty'>;
        year: number | string;
        rating: number | string;
        genre: string;
        page: number | string;
        take: number | string;
        audio: string;
        subtitles: string;
        studio: string;
    }>;

    export const method = 'GET'
    export const url = '/movies/library'

    export const queryParams = (params?: QueryParams) => {
        return params
    }

    export const queryKey = (params?: QueryParams) => {
        const queryKey: QueryKey = ['client/movies/library', params];

        return queryKey;
    }

    export type ResponseData = {
        movies: (MinimalMovie & { trandRating?: number })[],
        total: number;
        studios: Studio[];
    }
}