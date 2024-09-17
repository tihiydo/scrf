import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetAllDevices } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GetAllDevices.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'>;

export const useDevices = (queryOptions: QureyOptions = {}, axiosConfig: AxiosOptions = {}) => {
    return useQuery({
        ...queryOptions,
        queryKey: GetAllDevices.queryKey,
        queryFn: async () => {
            const response = await apiClient<GetAllDevices.ResponseData>({
                ...axiosConfig,
                url: GetAllDevices.url,
                method: GetAllDevices.method,
            })

            return response.data;
        }
    })
}