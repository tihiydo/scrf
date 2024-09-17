'use client';

import { apiClient } from "@/app/api/client";
import { RefreshJWT } from ".";
import { AxiosRequestConfig } from "axios";



export function refreshJWTToken(axiosConfig?: TypedOmit<AxiosRequestConfig, 'url' | 'method'>) {
    return apiClient<RefreshJWT.ResponseData>({ 
        ...axiosConfig,
        method: RefreshJWT.method,
        url: RefreshJWT.url,
    })
}