import { SubscriptionHistoryItem } from "@/entities/subscription/history";
import { QueryKey } from "@tanstack/react-query"
import { AxiosRequestConfig } from "axios"


export namespace GetSubscriptionHistory {
    export const config: AxiosRequestConfig = {
        method: 'GET',
        url: '/subscriptions/history',
    }

    export const queryKeys: QueryKey = ['client/subscription/get-history'];
    // For complex query keys
    // export const queryKeys: (id: string) => QueryKey = (id) => ['client/subscription/get-history', id];

    export type Response = {
        history: SubscriptionHistoryItem[]
    }
}