import { User } from "@/entities/user";
import { MutationKey, QueryKey } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";


export namespace LoginRequest {
    export const method = 'POST'
    export const url = "/auth/login";
    export const config: AxiosRequestConfig = {
        withCredentials: true
    };

    export const mutationKeys: MutationKey = ['auth/login']

    export type RequestBody = {
        email: string;
        password: string;
    }

    export type ResponseData = {
        user: User;
        accessToken: string;
    }
}


// POST method
export namespace RegisterRequest {
    export const method = 'POST'
    export const url = '/auth/register';
    export const mutationKeys: MutationKey = ["auth/register"]

    export type RequestBody = {
        email: string;
        password: string;
    }

    export type ResponseData = {
        user: User;
        accessToken: string;
    }
}


export namespace VerificationRequest {
    export const method = 'POST'
    export const url: (token: string) => string = (token) => (
        `/auth/verify/${token}`
    )

    export const mutationKeys: (token: string) => MutationKey = (token) => (
        ['auth/verification', token]
    )

    export type ResponseData = unknown
}