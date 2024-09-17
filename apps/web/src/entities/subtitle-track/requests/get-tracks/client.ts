import { apiClient } from "@/app/api/client";
import { GetSubtitleTracks } from ".";
import { AxiosRequestConfig } from "axios";


export type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'> & {
    imdbid: string
}

export async function getSubtitleTracks(axiosConfig: AxiosOptions) {
    const response = await apiClient<GetSubtitleTracks.ResponseData>({
        ...axiosConfig,
        url: GetSubtitleTracks.url(axiosConfig.imdbid),
        method: GetSubtitleTracks.method,
    })

    return response;
}