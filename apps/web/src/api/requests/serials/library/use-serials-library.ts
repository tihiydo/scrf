'use client'

import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { SerialsLibrary } from "."
import { AxiosInternalApiError } from "@/types"
import { apiClient } from "@/app/api/client"


type Args = {
    params: SerialsLibrary.QueryParams
} & Omit<UseQueryOptions<SerialsLibrary.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'>
export function useSerialsLibrary({
    params,
    ...opts
}: Args) {
    return useQuery({
        ...opts,
        queryKey: SerialsLibrary.queryKey(params),
        queryFn: async () => {
            const response = await apiClient.get<SerialsLibrary.ResponseData>(SerialsLibrary.url, {
                params: SerialsLibrary.queryParams(params)
            })

            return response.data
        }
    })
}