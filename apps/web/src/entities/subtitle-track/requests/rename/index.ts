import { SubtitleTrack } from "../..";
import { useRenameSubtitleTrack } from "./use-mutation";

export namespace RenameSubtitleTrack {
    export const url = (id: string) => `/subtitle-tracks/rename/${id}`;
    export const method = 'PUT';
    export const body = (body: Body) => body;
    export const useMutation = useRenameSubtitleTrack


    export type MutationInput = {
        id: string;
        newName: string;
    }

    export type Body = {
        name: string;
    }

    export type ResponseData = SubtitleTrack;
}