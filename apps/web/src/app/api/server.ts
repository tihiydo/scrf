import { env } from '@/env';
import axios, { AxiosError } from 'axios';
import { getCookie, getCookies } from 'cookies-next';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const apiServer = (headers : () => ReadonlyHeaders) =>
{
    const headersObj: { [key: string]: string } = {};
    for (const [key, value] of headers().entries()) 
    {
        headersObj[key] = value;
    }

    return axios.create({
        baseURL: env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: headersObj
    });
}