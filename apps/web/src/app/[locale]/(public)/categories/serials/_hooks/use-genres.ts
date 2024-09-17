import { apiClient } from "@/app/api/client";
import { apiServer } from "@/app/api/server";
import { FILTERS_KEYS } from "@/constants/query-keys";
import { AxiosInternalApiError } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { headers } from 'next/headers';

type GenresResponse = Array<{
    id: string;
    slug: string;
    genreName: string;
}>

export const useGenres = () => {
    const genresQuery = useQuery<GenresResponse, AxiosInternalApiError>({
        queryKey: [FILTERS_KEYS.GET_GENRES],
        queryFn: async () => {
            
            const response = await apiClient.get<GenresResponse>('/genres');
           
            return response.data;
        },
    })

    return genresQuery
}