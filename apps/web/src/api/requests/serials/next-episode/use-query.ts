import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"
import { GetNextEpisode } from "."

type QureyOptions = Omit<UseQueryOptions<GetNextEpisode.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    imdbid: string;
}

type AxiosOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

export const useNextEpisode = ({ imdbid, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetNextEpisode.queryKey(imdbid),
        queryFn: async () => {
            const response = await apiClient<GetNextEpisode.ResponseData>({
                ...axiosConfig,
                url: GetNextEpisode.url(imdbid),
                method: GetNextEpisode.method,
            })

            return response.data;
        }
    })
}