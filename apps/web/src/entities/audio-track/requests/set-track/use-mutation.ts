import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";
import { SetAudioTrack } from ".";

type Options = Omit<UseMutationOptions<SetAudioTrack.ResponseData, AxiosInternalApiError, SetAudioTrack.MutationInputData>, 'mutationFn' | 'mutationKey'> & {
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
};

export const useSetAudioTrackMutation = ({ config, ...options }: Options) => {
    return useMutation({
        ...options,
        mutationFn: async ({ imdbid, kind, m3u8Id, name }) => {
            const response = await apiClient<SetAudioTrack.ResponseData>({
                ...config,
                url: SetAudioTrack.url,
                method: SetAudioTrack.method,
                data: SetAudioTrack.body({
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