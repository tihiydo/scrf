import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { RenameSubtitleTrack } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<RenameSubtitleTrack.ResponseData, AxiosInternalApiError, RenameSubtitleTrack.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useRenameSubtitleTrack = (mutationOptions: MutationOptions = {}, axiosConfig: AxiosOptions = {}) => {
    return useMutation({
        ...mutationOptions,
        mutationFn: async ({ id, newName }) => {
            const response = await apiClient<RenameSubtitleTrack.ResponseData>({
                ...axiosConfig,
                url: RenameSubtitleTrack.url(id),
                method: RenameSubtitleTrack.method,
                data: RenameSubtitleTrack.body({ name: newName })
            })

            return response.data
        }
    })
}

