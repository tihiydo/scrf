import { AxiosRequestConfig } from "axios"
import { GetMovie } from "."
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"
import { apiServer } from "@/app/api/server"

type Config = Omit<AxiosRequestConfig, 'url'> & {
    slug: string
}


export const getServerMovie = (headers: () => ReadonlyHeaders, config: Config) => {
    return apiServer(headers).get<GetMovie.ResponseData>(
        GetMovie.url(config.slug),
        {
            ...config,
        }
    )
}