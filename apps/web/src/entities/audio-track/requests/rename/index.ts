import { AudioTrack } from "../..";
import { useRenameAudioTrack } from "./use-mutation";

export namespace RenameAudioTrack {
    export const url = (id: string) => `/audio-tracks/rename/${id}`;
    export const method = 'PUT';
    export const body = (body: Body) => body;
    export const useMutation = useRenameAudioTrack


    export type MutationInput = {
        id: string;
        newName: string;
    }

    export type Body = {
        name: string;
    }

    export type ResponseData = AudioTrack;
}