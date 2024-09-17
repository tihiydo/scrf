import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosInternalApiError } from "@/types";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/app/api/client";
import { RemoveListFiction } from ".";

type Options = Omit<UseMutationOptions<RemoveListFiction.ResponseData, AxiosInternalApiError, {
    slug: string;
    fictionImdbid: string;
    type: 'movie' | 'serial';
}>, 'mutationFn' | 'mutationKey'> & {
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
};

export const useRemoveListFiction = ({ config, ...options }: Options) => {

    return useMutation({
        ...options,
        mutationFn: async ({ fictionImdbid, slug, type }) => {
            const response = await apiClient<RemoveListFiction.ResponseData>({
                ...config,
                url: RemoveListFiction.url(slug),
                method: RemoveListFiction.method,
                data: RemoveListFiction.body({
                    movie: type === 'movie' ? fictionImdbid : undefined,
                    serial: type === 'serial' ? fictionImdbid : undefined
                })

            })

            return response.data;
        }
    })
}
