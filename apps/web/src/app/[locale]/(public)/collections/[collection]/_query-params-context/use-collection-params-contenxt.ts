import { useContext } from "react"
import { CollectionQueryParamsContext } from "./collection-context"

export const useCollectionQueryParamsContext = () => {
    return useContext(CollectionQueryParamsContext)
}