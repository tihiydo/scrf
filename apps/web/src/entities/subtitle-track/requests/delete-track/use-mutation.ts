import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteSubtitleTrack } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<DeleteSubtitleTrack.ResponseData, AxiosInternalApiError, DeleteSubtitleTrack.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url'>;

export const useDeleteSubtitleTrack = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ id }) => {
            const response = await apiClient<DeleteSubtitleTrack.ResponseData>({
                ...axiosConfig,
                url: DeleteSubtitleTrack.url(id),
                method: DeleteSubtitleTrack.method,
            })

            return response.data
        }
    })
}

