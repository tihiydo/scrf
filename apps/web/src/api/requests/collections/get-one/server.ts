

import { apiServer } from "@/app/api/server";
import { AxiosRequestConfig } from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { GetOneCollection } from ".";

type Config = TypedOmit<AxiosRequestConfig, 'params' | 'url' | 'method'> & {
    params?: GetOneCollection.QueryParams;
    slug: string;
}

export async function getServerOneCollection(headers: () => ReadonlyHeaders, config: Config) {
    return apiServer(headers)<GetOneCollection.ResponseData>({
        ...config,
        url: GetOneCollection.url(config.slug),
        params: GetOneCollection.queryParams(config.params),
        method: GetOneCollection.method
    })
}