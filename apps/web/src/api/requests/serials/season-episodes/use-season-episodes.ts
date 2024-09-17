import { UndefinedInitialDataOptions, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { SeasonEpisodes } from ".";
import { apiClient } from "@/app/api/client";
import { AxiosInternalApiError } from "@/types";


type Args = {
    serial: string;
    season: number;
} & Omit<UseQueryOptions<SeasonEpisodes.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'>
export function useSeasonEpisodes({ season, serial, ...opts }: Args) {
    return useQuery({
        ...opts,
        queryKey: SeasonEpisodes.queryKey(serial, season),
        queryFn: async () => {
            const response = await apiClient.get<SeasonEpisodes.ResponseData>(
                SeasonEpisodes.url(serial, season)
            )

            return response.data;
        },
    })
}