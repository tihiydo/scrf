import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"
import { GetPrevEpisode } from "."

type QureyOptions = Omit<UseQueryOptions<GetPrevEpisode.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    imdbid: string;
}

type AxiosOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

export const usePrevEpisode = ({ imdbid, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetPrevEpisode.queryKey(imdbid),
        queryFn: async () => {
            const response = await apiClient<GetPrevEpisode.ResponseData>({
                ...axiosConfig,
                url: GetPrevEpisode.url(imdbid),
                method: GetPrevEpisode.method,
            })

            return response.data;
        }
    })
}