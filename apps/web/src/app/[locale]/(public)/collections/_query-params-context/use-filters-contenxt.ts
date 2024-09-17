import { useContext } from "react"
import { FiltersContext } from "./filters-context"

export const useFiltersContext = () => {
    return useContext(FiltersContext)
}