import { AxiosRequestConfig } from "axios";
import { apiClient } from "../client";

type Args = {
    file: File;
    collection: string;
    path?: string[];
    allowedExts?: string[];
    
}
export function uploadSingleFile(
    { allowedExts, collection, file, path }: Args,
    config?: AxiosRequestConfig
) {
    const formData = new FormData();

    if (allowedExts) {
        formData.append('allowed', allowedExts.join(','))
    };

    if (path) {
        formData.append('path', path.join(','))
    };

    formData.append('collection', collection);
    formData.append('file', file);

    return apiClient.post<{
        filename: string,
        path: string;
        url: string;
    }>('/upload', formData, config)
}