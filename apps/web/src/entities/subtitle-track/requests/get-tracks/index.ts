import { QueryClient, QueryKey } from "@tanstack/react-query";
import { SubtitleTrack } from "../..";
import { useSubtitleTracksQuery } from "./use-query";
import { getSubtitleTracks } from "./client";


export namespace GetSubtitleTracks {
    export const url = (imdbid: string) => '/subtitle-tracks/' + imdbid;
    export const method = 'GET';
    export const queryKey = (imdbid: string): QueryKey => ['subtitle-tracks/get-by-imdb', imdbid]
    export const useQuery = useSubtitleTracksQuery
    export const clientFetch = getSubtitleTracks

    export const invalidate = (queryClient: QueryClient, data: { imdbid: string }) => {
        queryClient.invalidateQueries({
            queryKey: queryKey(data.imdbid)
        })
    }

    export type ResponseData = SubtitleTrack[];
}