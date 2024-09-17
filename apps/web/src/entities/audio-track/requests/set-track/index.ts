import { AudioTrack, AudioTrackKind } from "../..";
import { useSetAudioTrackMutation } from "./use-mutation";

export namespace SetAudioTrack {
    export const url = '/subtitle-tracks';
    export const method = 'POST';
    export const body = (body: Body) => body
    export const useMutation = useSetAudioTrackMutation;

    
    export type MutationInputData = Body;

    export type Body = {
        name: string;
        kind: AudioTrackKind;
        m3u8Id: string;
        imdbid: string;
    }

    export type ResponseData = AudioTrack;
}