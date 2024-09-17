import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { AddListFiction } from "."
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";

type Options = Omit<UseMutationOptions<AddListFiction.ResponseData, AxiosInternalApiError, {
    slug: string;
    fictionImdbid: string;
    type: 'movie' | 'serial';
}>, 'mutationFn' | 'mutationKey'> & {
  

    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
};

export const useListAddFiction = ({config, ...options}: Options) => {

    return useMutation({
        ...options,
        mutationFn: async ({ fictionImdbid, slug, type}) => {
            const response = await apiClient<AddListFiction.ResponseData>({
                ...config,
                url: AddListFiction.url(slug),
                method: AddListFiction.method,
                data: AddListFiction.body({
                    movie: type === 'movie' ? fictionImdbid : undefined,
                    serial: type === 'serial' ? fictionImdbid : undefined
                })
                
            })

            return response.data;
        }
    })
}
