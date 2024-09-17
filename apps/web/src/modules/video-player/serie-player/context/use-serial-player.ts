import { useContext } from "react"
import { SeriePlayerContext } from "./provider"


export const useSerialPlayer = () => {
    return useContext(SeriePlayerContext)
}