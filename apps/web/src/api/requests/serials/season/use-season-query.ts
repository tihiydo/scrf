import { useQuery } from "@tanstack/react-query";
import { GetSeason } from ".";

export function useSeasonQuery(serial: string, season: string | number, query?: GetSeason.QueryParams) {
    return useQuery({
        queryKey: GetSeason.queryKey(serial, season, query),
        queryFn: () => {
            
        }
    })
}