import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { GetMovie } from "."
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client";

type Args =  Omit<UseQueryOptions<GetMovie.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    slug: string;
}
export function useMovie({
    slug,
    ...opts
}: Args) {
    return useQuery({
        ...opts,
        queryKey: GetMovie.queryKey(slug),
        queryFn: async () => {
            const response = await apiClient.get<GetMovie.ResponseData>(GetMovie.url(slug))

            return response.data
        }
    })
}

