'use client';

import { MoviesLibrary } from "@/api/requests/movies/library";
import { FiltersContext } from "./filters-context";
import { Filters, FiltersSchema } from "./schema";
import { useTypesafeSearchParams } from "@/hooks/use-typesafe-search-params";

type Props = {
  children?: React.ReactNode;
  response: MoviesLibrary.ResponseData
}

const FiltersContextProvider = ({ children, response }: Props) => {
  const [searchParams, setSearchParams, isSynced] = useTypesafeSearchParams<Filters>(FiltersSchema)

  return (
    <FiltersContext.Provider
      value={{
        searchParams,
        setSearchParams,
        isSynced,
        response
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export default FiltersContextProvider