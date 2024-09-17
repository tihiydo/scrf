import { SubtitleTrack } from "../..";
import { useDeleteSubtitleTrack } from "./use-mutation";

export namespace DeleteSubtitleTrack {
    export const url = (id: string) => `/audio-tracks/${id}`;
    export const method = 'DELETE';
    export const body = (body: Body) => body;
    export const useMutation = useDeleteSubtitleTrack


    export type MutationInput = {
        id: string;
    }

    export type ResponseData = SubtitleTrack;
}