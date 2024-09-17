import { useContext } from "react"
import { LiveStreamPlayerContext } from "./provider"


export const useLiveStreamPlayer = () => {
    return useContext(LiveStreamPlayerContext)
}