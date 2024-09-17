import { Movie } from "@/entities/movie"
import { QueryKey } from "@tanstack/react-query"
import { getServerMovie } from "./server"
import { useMovie } from "./use-movie"


export namespace GetMovie {
    export const url = (slug: string) => (
        `/movies/${slug}`
    )
    export const method = 'GET'
    export const queryKey = (slug: string): QueryKey => (
        ['/movies/get', slug]
    )

    export const serverFetch = getServerMovie;
    export const useQuery = useMovie;

    export type ResponseData = Movie
}