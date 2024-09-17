import { createContext } from "react";
import { Filters } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";
import { SerialsLibrary } from "@/api/requests/serials/library";

type TypesafeSearchParams = ReturnType<typeof useTypesafeSearchParams<Filters>>

export const FiltersContext = createContext<{
    searchParams: TypesafeSearchParams[0];
    setSearchParams: TypesafeSearchParams[1];
    isSynced: TypesafeSearchParams[2];
    response: SerialsLibrary.ResponseData,
}>({
    searchParams: {} as any,
    setSearchParams: () => { },
    isSynced: true,
    response: {
        serials: [],
        studios: [],
        total: 0
    }
});