import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteCollection } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<any, AxiosInternalApiError, DeleteCollection.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useDeleteCollection = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ slug }) => {
            const response = await apiClient({
                ...axiosConfig,
                url: DeleteCollection.url(slug),
                method: DeleteCollection.method,
            })

            return response.data
        }
    })
}

