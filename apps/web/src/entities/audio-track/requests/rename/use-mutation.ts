import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { RenameAudioTrack } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<RenameAudioTrack.ResponseData, AxiosInternalApiError, RenameAudioTrack.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useRenameAudioTrack = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ id, newName }) => {
            const response = await apiClient<RenameAudioTrack.ResponseData>({
                ...axiosConfig,
                url: RenameAudioTrack.url(id),
                method: RenameAudioTrack.method,
                data: RenameAudioTrack.body({ name: newName })
            })

            return response.data
        }
    })
}

