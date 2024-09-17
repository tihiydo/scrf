import { List } from "@/entities/lists";
import { MutationKey } from "@tanstack/react-query";
import { useListAddFiction } from "./use-list-add-fiction";


export namespace AddListFiction {
    export type Body = {
        serial?: string;
        movie?: string;
    }
    export const body = (data: Body) => data;
    export const url = (slug: string) => `/lists/fiction/${slug}`
    export const method = 'POST'
    export const mutationKey = (id: string): MutationKey => ['lists/add-fiction', id]
    export const useMutation = useListAddFiction

    export type ResponseData = {
        list: List
    }
}