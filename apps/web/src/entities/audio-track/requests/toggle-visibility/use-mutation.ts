import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ToggleAudioTrackVisibility } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<ToggleAudioTrackVisibility.ResponseData, AxiosInternalApiError, ToggleAudioTrackVisibility.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useToggleVisibleAudioTrack = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ id, visible }) => {
            const response = await apiClient<ToggleAudioTrackVisibility.ResponseData>({
                ...axiosConfig,
                url: ToggleAudioTrackVisibility.url(id),
                method: ToggleAudioTrackVisibility.method,
                data: ToggleAudioTrackVisibility.body({ visible })
            })

            return response.data
        }
    })
}

