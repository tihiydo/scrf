'use client'

import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client"
import { GetEpisode } from "."


type Args = {
    params?: GetEpisode.QueryParams;
    episode: string | number;
    season: string | number;
    serial: string;
} & Omit<UseQueryOptions<GetEpisode.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'>
export function useEpisode({
    params,
    episode,
    season,
    serial,
    ...opts
}: Args) {
    return useQuery({
        ...opts,
        queryKey: GetEpisode.queryKey({ episode, season, serial }, params ?? {}),
        queryFn: async () => {
            const response = await apiClient.get<GetEpisode.ResponseData>(GetEpisode.url({ episode, season, serial }), {
                params: GetEpisode.params(params),
            })

            return response.data
        }
    })
}