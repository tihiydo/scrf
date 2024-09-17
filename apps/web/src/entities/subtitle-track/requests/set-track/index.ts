import { SubtitleTrack, SubtitleTrackKind } from "../..";
import { useSetSubtitleTrackMutation } from "./use-mutation";

export namespace SetSubtitleTrack {
    export const url = '/subtitle-tracks';
    export const method = 'POST';
    export const body = (body: Body) => body
    export const useMutation = useSetSubtitleTrackMutation;

    
    export type MutationInputData = Body;

    export type Body = {
        name: string;
        kind: SubtitleTrackKind;
        m3u8Id: string;
        imdbid: string;
    }

    export type ResponseData = SubtitleTrack;
}