import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { EditManyCollections } from ".";
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";


type MutationOptions = TypedOmit<UseMutationOptions<EditManyCollections.ResponseData, AxiosInternalApiError, EditManyCollections.MutationInput>, 'mutationKey' | 'mutationFn'>

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'method' | 'url' | 'data'> & {};

export const useEditCollections = (mutationOptions?: MutationOptions, axiosConfig?: AxiosOptions) => {
    return useMutation({
        ...(mutationOptions ?? {}),
        mutationFn: async ({ collections }) => {
            const response = await apiClient<EditManyCollections.ResponseData>({
                ...axiosConfig,
                url: EditManyCollections.url,
                method: EditManyCollections.method,
                data: EditManyCollections.body({ collections })
            })

            return response.data
        }
    })
}

