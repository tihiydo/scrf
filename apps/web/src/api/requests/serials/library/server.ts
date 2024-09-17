import { apiServer } from "@/app/api/server";
import { AxiosRequestConfig } from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { SerialsLibrary } from ".";

type Config = Omit<AxiosRequestConfig, 'params'> & {
    params?: SerialsLibrary.QueryParams
}

export async function getServerSerials(headers: () => ReadonlyHeaders, config: Config = {}) {
    return apiServer(headers).get<SerialsLibrary.ResponseData>(SerialsLibrary.url, {
        ...config,
        params: SerialsLibrary.queryParams(config.params)
    })
}