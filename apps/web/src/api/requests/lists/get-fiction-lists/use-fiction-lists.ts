import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client";
import { GetFictionLists } from ".";

type Args =  Omit<UseQueryOptions<GetFictionLists.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    fictionImdbid: string;
}
export function useFictionLists({
    fictionImdbid,
    ...opts
}: Args) {
    return useQuery({
        ...opts,
        queryKey: GetFictionLists.queryKey(fictionImdbid),
        queryFn: async () => {
            const response = await apiClient.get<GetFictionLists.ResponseData>(GetFictionLists.url(fictionImdbid))

            return response.data
        }
    })
}

