import { useContext } from "react"
import { MoviePlayerContext } from "./provider"


export const useMoviePlayer = () => {
    return useContext(MoviePlayerContext)
}