import { createContext } from "react";
import { Filters } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";

type TypesafeSearchParams = ReturnType<typeof useTypesafeSearchParams<Filters>>

export const FiltersContext = createContext<{
    searchParams: TypesafeSearchParams[0];
    setSearchParams: TypesafeSearchParams[1];
    isSynced: TypesafeSearchParams[2];
}>({
    searchParams: {} as any,
    setSearchParams: () => { },
    isSynced: true
});