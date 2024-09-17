import { Episode } from "@/entities/serial/episode";
import { QueryKey } from "@tanstack/react-query";
import { useNextEpisode } from "./use-query";


export namespace GetNextEpisode {
    type Relation = 'serial' | 'season'

    /**
     * @param currentEpisodeImdbid - Imdb id of current episode
     */
    export const url = (imdbid: string) => {
        return `/serials/episode/next/${imdbid}`
    }

    export const method = 'GET';

    export const queryKey = (imdbid: string) => {
        const queryKey: QueryKey = [`serial/next-episode`, imdbid];

        return queryKey;
    }

    export const useQuery = useNextEpisode;

    export type ResponseData = Episode;
}