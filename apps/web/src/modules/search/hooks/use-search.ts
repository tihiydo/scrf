import { apiClient } from "@/app/api/client"
import { SEARCH_KEY } from "@/constants/query-keys"
import { MinimalMovie } from "@/entities/movie"
import { MinimalSerial } from "@/entities/serial"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export const useSearch = () => {
    const searchStrState = useState('');
    const [searchStr] = searchStrState

    const searchQuery = useQuery({
        enabled: false,
        queryKey: [SEARCH_KEY, searchStr],
        queryFn: async ({ queryKey }) => {
            const searchStr = queryKey[1];

            const response = await apiClient.get<{
                movies: MinimalMovie[];
                serials: MinimalSerial[];
            }>(
                '/search',
                {
                    params: {
                        searchStr: searchStr
                    }
                }
            )

            return response.data;
        }
    })

    return {
        search: searchStrState,
        searchQuery
    }
}