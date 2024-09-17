import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GlobalSearch } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GlobalSearch.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn' | 'enabled'> & {
    searchString: string;
    params?: TypedOmit<GlobalSearch.QueryParams, 'searchStr'>
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method' | 'params'>;

export const useSearch = ({ params, searchString, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        enabled: typeof searchString === 'string' ? searchString.length > 1 : false,
        queryKey: GlobalSearch.queryKey({ ...params, searchStr: searchString }),
        queryFn: async () => {
            const response = await apiClient<GlobalSearch.ResponseData>({
                ...axiosConfig,
                url: GlobalSearch.url,
                method: GlobalSearch.method,
                params: GlobalSearch.queryParams({
                    ...params,
                    searchStr: searchString
                })
            })

            return response.data;
        }
    })
}