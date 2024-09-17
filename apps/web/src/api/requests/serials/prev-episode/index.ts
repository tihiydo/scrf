import { Episode } from "@/entities/serial/episode";
import { QueryKey } from "@tanstack/react-query";
import { usePrevEpisode } from "./use-query";


export namespace GetPrevEpisode {
    type Relation = 'serial' | 'season'

    /**
     * @param currentEpisodeImdbid - Imdb id of current episode
     */
    export const url = (imdbid: string) => {
        return `/serials/episode/prev/${imdbid}`
    }

    export const method = 'GET';

    export const queryKey = (imdbid: string) => {
        const queryKey: QueryKey = [`serial/prev-episode`, imdbid];

        return queryKey;
    }

    export const useQuery = usePrevEpisode;

    export type ResponseData = Episode;
}