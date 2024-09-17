import { AxiosRequestConfig } from "axios"
import { GetAllLists } from "."
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"
import { apiServer } from "@/app/api/server"

type Config = Omit<AxiosRequestConfig, 'url'> & {
}

export const getServerAllLists = (headers: () => ReadonlyHeaders, config: Config) => {
    return apiServer(headers).get<GetAllLists.ResponseData>(
        GetAllLists.url,
        {
            ...config,
        }
    )
}