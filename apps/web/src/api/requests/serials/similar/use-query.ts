import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetSimilarSerials } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QueryOptions = TypedOmit<UseQueryOptions<GetSimilarSerials.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    imdbid: string
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'>;

export const useSimilarSerials = ({ imdbid, ...queryOptions }: QueryOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetSimilarSerials.queryKey(imdbid),
        queryFn: async () => {
            const response = await apiClient<GetSimilarSerials.ResponseData>({
                ...axiosConfig,
                url: GetSimilarSerials.url(imdbid),
                method: GetSimilarSerials.method,
            })

            return response.data;
        }
    })
}
