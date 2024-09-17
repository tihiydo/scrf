import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteAudioTrack } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<DeleteAudioTrack.ResponseData, AxiosInternalApiError, DeleteAudioTrack.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url'>;

export const useDeleteAudioTrack = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ id }) => {
            const response = await apiClient<DeleteAudioTrack.ResponseData>({
                ...axiosConfig,
                url: DeleteAudioTrack.url(id),
                method: DeleteAudioTrack.method,
            })

            return response.data
        }
    })
}

