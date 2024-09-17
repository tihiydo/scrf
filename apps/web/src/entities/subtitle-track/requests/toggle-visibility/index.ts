import { SubtitleTrack } from "../..";
import { useToggleVisibleSubtitleTrack } from "./use-mutation";


export namespace ToggleSubtitleTrackVisibility {
    export const url = (id: string) => `/subtitle-tracks/visible/${id}`;
    export const method = 'PUT';
    export const body = (body: Body) => body;
    export const useMutation = useToggleVisibleSubtitleTrack


    export type MutationInput = {
        id: string;
    } & Body;

    export type Body = {
        visible?: boolean;
    }

    export type ResponseData = SubtitleTrack;
}
