import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client";
import { GetAllLists } from ".";

type Args =  Omit<UseQueryOptions<GetAllLists.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
}
export function useAllLists(opts: Args) {
    return useQuery({
        ...opts,
        queryKey: GetAllLists.queryKey,
        queryFn: async () => {
            const response = await apiClient.get<GetAllLists.ResponseData>(GetAllLists.url)

            return response.data
        }
    })
}

