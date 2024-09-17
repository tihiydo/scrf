import { AudioTrack } from "../..";
import { useToggleVisibleAudioTrack } from "./use-mutation";


export namespace ToggleAudioTrackVisibility {
    export const url = (id: string) => `/audio-tracks/visible/${id}`;
    export const method = 'PUT';
    export const body = (body: Body) => body;
    export const useMutation = useToggleVisibleAudioTrack


    export type MutationInput = {
        id: string;
    } & Body;

    export type Body = {
        visible?: boolean;
    }

    export type ResponseData = AudioTrack;
}
