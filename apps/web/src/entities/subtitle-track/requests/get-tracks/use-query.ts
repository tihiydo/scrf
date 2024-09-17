import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetSubtitleTracks } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = Omit<UseQueryOptions<GetSubtitleTracks.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    imdbid: string;
}

type AxiosOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

export const useSubtitleTracksQuery = ({ imdbid, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetSubtitleTracks.queryKey(imdbid),
        queryFn: async () => {
            const response = await apiClient<GetSubtitleTracks.ResponseData>({
                ...axiosConfig,
                url: GetSubtitleTracks.url(imdbid),
                method: GetSubtitleTracks.method,
            })

            return response.data;
        }
    })
}