import { MinimalMovie } from "@/entities/movie";
import { QueryKey } from "@tanstack/react-query";
import { useSimilarMovies } from "./use-query";


export namespace GetSimilarMovies {
    export const url = (imdbid: string) => `/movies/similar/${imdbid}`
    export const method = 'GET'
    export const queryKey = (imdbid: string): QueryKey => (
        ['movies/similar', imdbid]
    )
    export const useQuery = useSimilarMovies;

    export type ResponseData = MinimalMovie[];
}