import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetAudioTracks } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = Omit<UseQueryOptions<GetAudioTracks.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    imdbid: string;
}

type AxiosOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

export const useAudioTracksQuery = ({ imdbid, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetAudioTracks.queryKey(imdbid),
        queryFn: async () => {
            const response = await apiClient<GetAudioTracks.ResponseData>({
                ...axiosConfig,
                url: GetAudioTracks.url(imdbid),
                method: GetAudioTracks.method,
            })

            return response.data;
        }
    })
}