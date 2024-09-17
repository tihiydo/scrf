import { List } from "@/entities/lists";
import { MutationKey } from "@tanstack/react-query";
import { useRemoveListFiction } from "./use-remove-list-fiction";


export namespace RemoveListFiction {
    export type Body = {
        serial?: string;
        movie?: string;
    }
    export const body = (data: Body) => data;
    export const url = (slug: string) => `/lists/fiction/${slug}`
    export const method = 'DELETE'
    export const mutationKey = (id: string): MutationKey => ['lists/remove-fiction', id]
    export const useMutation = useRemoveListFiction;

    export type ResponseData = {
        list: List
    }
}