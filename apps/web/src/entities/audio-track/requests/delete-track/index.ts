import { AudioTrack } from "../..";
import { useDeleteAudioTrack } from "./use-mutation";

export namespace DeleteAudioTrack {
    export const url = (id: string) => `/audio-tracks/${id}`;
    export const method = 'DELETE';
    export const body = (body: Body) => body;
    export const useMutation = useDeleteAudioTrack


    export type MutationInput = {
        id: string;
    }

    export type ResponseData = AudioTrack;
}