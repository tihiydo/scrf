import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetOneCollection } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GetOneCollection.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    slug: string;
    params?: GetOneCollection.QueryParams;
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method' | 'params'>;

export const useCollection = ({ slug, params, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetOneCollection.queryKey(slug, params),
        queryFn: async () => {
            const response = await apiClient<GetOneCollection.ResponseData>({
                ...axiosConfig,
                url: GetOneCollection.url(slug),
                method: GetOneCollection.method,
                params
            })

            return response.data;
        }
    })
}