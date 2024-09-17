import { createContext } from "react";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";
import { CollectionQueryParams } from "./schema";

type TypesafeSearchParams = ReturnType<typeof useTypesafeSearchParams<CollectionQueryParams>>

export const CollectionQueryParamsContext = createContext<{
    searchParams: TypesafeSearchParams[0];
    setSearchParams: TypesafeSearchParams[1];
    isSynced: TypesafeSearchParams[2];
}>({
    searchParams: {} as any,
    setSearchParams: () => { },
    isSynced: true
});