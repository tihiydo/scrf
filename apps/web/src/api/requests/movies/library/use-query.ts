import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { MoviesLibrary } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<MoviesLibrary.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    params?: MoviesLibrary.QueryParams
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'>;

export const useMovies = (queryOptions: QureyOptions = {}, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: MoviesLibrary.queryKey(queryOptions.params),
        queryFn: async () => {
            const response = await apiClient<MoviesLibrary.ResponseData>({
                ...axiosConfig,
                url: MoviesLibrary.url,
                method: MoviesLibrary.method,
            })

            return response.data;
        }
    })
}