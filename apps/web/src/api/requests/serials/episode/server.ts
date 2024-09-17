import { apiServer } from "@/app/api/server";
import { AxiosRequestConfig } from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { GetEpisode } from ".";

type Pizdec = Omit<AxiosRequestConfig, 'params'> & {
    params?: GetEpisode.QueryParams
}

export async function getServerEpisode(headers: () => ReadonlyHeaders, urlParams: GetEpisode.UrlParams, { params, ...config }: Pizdec = {}) {
    const url = GetEpisode.url({ episode: urlParams.episode, season: urlParams.season, serial: urlParams.serial });

    return apiServer(headers).get<GetEpisode.ResponseData>(url, {
        ...config,
        params: GetEpisode.params(params)
    })
}