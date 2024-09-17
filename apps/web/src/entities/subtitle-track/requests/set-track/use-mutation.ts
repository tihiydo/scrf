import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { SetSubtitleTrack } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";

type Options = Omit<UseMutationOptions<SetSubtitleTrack.ResponseData, AxiosInternalApiError, SetSubtitleTrack.MutationInputData>, 'mutationFn' | 'mutationKey'> & {
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
};

export const useSetSubtitleTrackMutation = ({ config, ...options }: Options) => {
    return useMutation({
        ...options,
        mutationFn: async ({ imdbid, kind, m3u8Id, name }) => {
            const response = await apiClient<SetSubtitleTrack.ResponseData>({
                ...config,
                url: SetSubtitleTrack.url,
                method: SetSubtitleTrack.method,
                data: SetSubtitleTrack.body({
                    imdbid,
                    kind,
                    m3u8Id,
                    name
                })

            })

            return response.data;
        }
    })
}