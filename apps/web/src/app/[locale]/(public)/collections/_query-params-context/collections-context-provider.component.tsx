'use client';

import { FiltersContext } from "./filters-context";
import { Filters, FiltersSchema } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";

type Props = {
  children?: React.ReactNode;
}

const CollectionsContextProvider = ({ children }: Props) => {
  const [searchParams, setSearchParams, isSynced] = useTypesafeSearchParams<Filters>(FiltersSchema)

  return (
    <FiltersContext.Provider
      value={{
        searchParams,
        setSearchParams,
        isSynced,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export default CollectionsContextProvider