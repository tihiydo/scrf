import { Episode } from "@/entities/serial/episode"
import { QueryKey } from "@tanstack/react-query"

export namespace SeasonEpisodes {
    export const url = (serial: string, season: number | string) => {
        return `/serials/${serial}/${season}/episodes`
    }

    export const queryKey = (serial: string, season: number | string) => {
        return [`client/episodes/${serial}/${season}`] satisfies QueryKey
    }

    export type ResponseData = Episode[];
}