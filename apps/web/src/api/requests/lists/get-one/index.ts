import { List } from "@/entities/lists"
import { getServerList } from "./server";
import { useList } from "./use-list";
import { QueryKey } from "@tanstack/react-query";


export namespace GetList {
    export const url = (slug: string) => (
        `/lists/${slug}`
    )
    export const queryKey = (slug: string): QueryKey => ['client/get-one-list', slug]
    export const method = 'GET'

    export type ResponseData = List;

    export const serverFetch = getServerList;
    export const useQuery = useList;
}