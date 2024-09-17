import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { EditCollection } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<EditCollection.ResponseData, AxiosInternalApiError, EditCollection.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useEditCollection = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async (input) => {
            const response = await apiClient({
                ...axiosConfig,
                url: EditCollection.url(input.slug),
                method: EditCollection.method,
                data: EditCollection.body(input)
            })

            return response.data
        }
    })
}

