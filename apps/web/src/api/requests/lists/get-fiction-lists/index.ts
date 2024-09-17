import { List } from "@/entities/lists";
import { QueryKey } from "@tanstack/react-query";
import { useFictionLists } from "./use-fiction-lists";

export namespace GetFictionLists {
    export const url = (imdbid: string) => `/lists/fiction/${imdbid}` 
    export const method = 'GET';
    export const queryKey = (imdbid: string): QueryKey => ['lists/get-fiction-lists', imdbid];
    export const useQuery = useFictionLists

    export type ResponseData = {
        lists: Omit<List, 'serials' | 'movies'>[]
    }
}