import { apiServer } from "@/app/api/server";
import { AxiosRequestConfig } from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { MoviesLibrary } from ".";

type Config = Omit<AxiosRequestConfig, 'params'> & {
    params?: MoviesLibrary.QueryParams
}

export async function getServerMovies(headers: () => ReadonlyHeaders, config: Config = {}) {
    return apiServer(headers).get<MoviesLibrary.ResponseData>(MoviesLibrary.url, {
        ...config,
        params: MoviesLibrary.queryParams(config.params)
    })
}