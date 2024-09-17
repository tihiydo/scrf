import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { GetList } from "."
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client";

type Args =  Omit<UseQueryOptions<GetList.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    slug: string;
}
export function useList({
    slug,
    ...opts
}: Args) {
    return useQuery({
        ...opts,
        queryKey: GetList.queryKey(slug),
        queryFn: async () => {
            const response = await apiClient.get<GetList.ResponseData>(GetList.url(slug))

            return response.data
        }
    })
}

