import { AudioTrack } from "@/entities/audio-track";
import { Serial } from "@/entities/serial";
import { QueryKey } from "@tanstack/react-query";


export namespace GetOneSerial {
    export type Relation = 'episodes' | 'seasons' | 'fiction'

    export type ResponseData = Serial & {
        audioTracks: AudioTrack[];
        subtitleTracks: AudioTrack[];
    };

    export const queryKey = (imdbid: string,) => {
        const queryKey: string[] = [`client/serials/${imdbid}`]

        return queryKey as QueryKey;
    }

    export const url = (imdbid: string) => (
        `/serials/${imdbid}`
    )
}