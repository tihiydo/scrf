import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetSimilarMovies } from "."
import { AxiosInternalApiError } from "@/types"
import { AxiosRequestConfig } from "axios"
import { apiClient } from "@/app/api/client"

type QureyOptions = TypedOmit<UseQueryOptions<GetSimilarMovies.ResponseData, AxiosInternalApiError>, 'queryKey' | 'queryFn'> & {
  imdbid: string
}

type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'>;

export const useSimilarMovies = ({ imdbid, ...queryOptions }: QureyOptions, axiosConfig: AxiosOptions = {}) => {
  return useQuery({
    ...queryOptions,
    queryKey: GetSimilarMovies.queryKey(imdbid),
    queryFn: async () => {
      const response = await apiClient<GetSimilarMovies.ResponseData>({
        ...axiosConfig,
        url: GetSimilarMovies.url(imdbid),
        method: GetSimilarMovies.method,
      })

      return response.data;
    }
  })
}