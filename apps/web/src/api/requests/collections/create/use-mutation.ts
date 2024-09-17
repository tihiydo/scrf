import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateCollection } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<CreateCollection.ResponseData, AxiosInternalApiError, CreateCollection.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export const useCreateCollection = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async (input) => {
            const response = await apiClient({
                ...axiosConfig,
                url: CreateCollection.url,
                method: CreateCollection.method,
                data: CreateCollection.body(input)
            })

            return response.data
        }
    })
}

