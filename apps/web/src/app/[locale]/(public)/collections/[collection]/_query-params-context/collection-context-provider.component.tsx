'use client';

import { CollectionQueryParamsContext } from "./collection-context";
import { CollectionQueryParams, CollectionQueryParamsSchema } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";

type Props = {
  children?: React.ReactNode;
}

const CollectionContextProvider = ({ children }: Props) => {
  const [searchParams, setSearchParams, isSynced] = useTypesafeSearchParams<CollectionQueryParams>(CollectionQueryParamsSchema)

  return (
    <CollectionQueryParamsContext.Provider
      value={{
        searchParams,
        setSearchParams,
        isSynced,
      }}
    >
      {children}
    </CollectionQueryParamsContext.Provider>
  )
}

export default CollectionContextProvider