import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetManyCollections } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GetManyCollections.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    params?: GetManyCollections.QueryParams;
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method' | 'params'>;

export const useCollections = ({ params, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetManyCollections.queryKey(params),
        queryFn: async () => {
            const response = await apiClient<GetManyCollections.ResponseData>({
                ...axiosConfig,
                url: GetManyCollections.url,
                method: GetManyCollections.method,
                params
            })

            return response.data;
        }
    })
}