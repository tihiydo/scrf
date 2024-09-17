import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ToggleSubtitleTrackVisibility } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<ToggleSubtitleTrackVisibility.ResponseData, AxiosInternalApiError, ToggleSubtitleTrackVisibility.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useToggleVisibleSubtitleTrack = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ id, visible }) => {
            const response = await apiClient<ToggleSubtitleTrackVisibility.ResponseData>({
                ...axiosConfig,
                url: ToggleSubtitleTrackVisibility.url(id),
                method: ToggleSubtitleTrackVisibility.method,
                data: ToggleSubtitleTrackVisibility.body({ visible })
            })

            return response.data
        }
    })
}

