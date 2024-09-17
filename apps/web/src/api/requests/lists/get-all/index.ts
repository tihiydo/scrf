import { List } from "@/entities/lists";
import { QueryKey } from "@tanstack/react-query";
import { getServerAllLists } from "./server";
import { useAllLists } from "./use-all-lists";

export namespace GetAllLists {
    export const url = '/lists'
    export const method = 'GET';
    export const queryKey: QueryKey = ['client/all-lists']
    export const serverFetch = getServerAllLists;
    export const useQuery = useAllLists;

    export type ResponseData = List[]
}