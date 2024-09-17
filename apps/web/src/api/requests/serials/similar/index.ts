import { QueryKey } from "@tanstack/react-query";
import { useSimilarSerials } from "./use-query";
import { MinimalSerial } from "@/entities/serial";


export namespace GetSimilarSerials {
    export const url = (imdbid: string) => `/serials/similar/${imdbid}`
    export const method = 'GET'
    export const queryKey = (imdbid: string): QueryKey => (
        ['serials/similar', imdbid]
    )
    export const useQuery = useSimilarSerials;

    export type ResponseData = MinimalSerial[];
}