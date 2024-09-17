import { QueryClient, QueryKey } from "@tanstack/react-query";
import { AudioTrack } from "../..";
import { useAudioTracksQuery } from "./use-query";
import { getAudioTracks } from "./client";


export namespace GetAudioTracks {
    export const url = (imdbid: string) => '/audio-tracks/' + imdbid;
    export const method = 'GET';
    export const queryKey = (imdbid: string): QueryKey => ['audio-tracks/get-by-imdb', imdbid]
    export const useQuery = useAudioTracksQuery
    export const clientFetch = getAudioTracks

    export const invalidate = (queryClient: QueryClient, data: { imdbid: string }) => {
        queryClient.invalidateQueries({
            queryKey: queryKey(data.imdbid)
        })
    }

    export type ResponseData = AudioTrack[];
}