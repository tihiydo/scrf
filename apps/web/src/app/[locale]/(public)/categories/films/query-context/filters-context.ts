import { createContext } from "react";
import { Filters } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";
import { MoviesLibrary } from "@/api/requests/movies/library";

type TypesafeSearchParams = ReturnType<typeof useTypesafeSearchParams<Filters>>

export const FiltersContext = createContext<{
    searchParams: TypesafeSearchParams[0];
    setSearchParams: TypesafeSearchParams[1];
    isSynced: TypesafeSearchParams[2];
    response: MoviesLibrary.ResponseData;
}>({
    searchParams: {} as any,
    setSearchParams: () => { },
    isSynced: true,
    response: {
        movies: [],
        studios: [],
        total: 0,
    }
});