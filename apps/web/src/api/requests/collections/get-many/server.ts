

import { apiServer } from "@/app/api/server";
import { AxiosRequestConfig } from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { GetManyCollections } from ".";

type Config = TypedOmit<AxiosRequestConfig, 'params' | 'url' | 'method'> & {
    params?: GetManyCollections.QueryParams
}

export async function getServerManyCollections(headers: () => ReadonlyHeaders, config: Config = {}) {
    return apiServer(headers)<GetManyCollections.ResponseData>({
        ...config,
        url: GetManyCollections.url,
        params: GetManyCollections.queryParams(config.params),
        method: GetManyCollections.method
    })
}