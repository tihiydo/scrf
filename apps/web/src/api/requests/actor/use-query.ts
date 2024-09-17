import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetAllActorsContent } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GetAllActorsContent.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
    slug: string
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'>;

export const useSimilarActors = ({ slug, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetAllActorsContent.queryKey(slug),
        queryFn: async () => {
            const response = await apiClient<GetAllActorsContent.ResponseData>({
                ...axiosConfig,
                url: GetAllActorsContent.url(slug),
                method: GetAllActorsContent.method,
            })

            return response.data;
        }
    })
}