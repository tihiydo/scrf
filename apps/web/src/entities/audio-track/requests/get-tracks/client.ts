import { apiClient } from "@/app/api/client";
import { GetAudioTracks } from ".";
import { AxiosRequestConfig } from "axios";


export type AxiosOptions = TypedOmit<AxiosRequestConfig, 'url' | 'method'> & {
    imdbid: string
}

export async function getAudioTracks(axiosConfig: AxiosOptions) {
    const response = await apiClient<GetAudioTracks.ResponseData>({
        ...axiosConfig,
        url: GetAudioTracks.url(axiosConfig.imdbid),
        method: GetAudioTracks.method,
    })

    return response;
}