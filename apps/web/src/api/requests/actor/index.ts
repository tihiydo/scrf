import { MinimalMovie } from "@/entities/movie";
import { QueryKey } from "@tanstack/react-query";
import { useSimilarActors } from "./use-query";


export namespace GetAllActorsContent {
    export const url = (slug: string) => `/personality/${slug}`
    export const method = 'GET'
    export const queryKey = (slug: string): QueryKey => (
        ['/personality', slug]
    )
    export const useQuery = useSimilarActors;

    export type ResponseData = MinimalMovie[];
}