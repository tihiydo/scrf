import useTimeout from "@/hooks/use-timeout"
import { useMediaQuery } from "@uidotdev/usehooks";
import { RefObject, useEffect, useState } from "react";
import { PlaybackControlStore } from "../stores/playback-store";

export function useControlsVisible(containerRef: RefObject<HTMLDivElement>, needPay: boolean, controls: {
    playback?: PlaybackControlStore
}) {
    const [controlsVisible, setControlsVisible] = useState(true);
    const isMobile = useMediaQuery('screen and (max-width: 1024px');


    const { reset } = useTimeout(() => {
        setControlsVisible(false)
    }, 3500)

    useEffect(() => {
        if (!controls.playback) return;

        if (controls.playback.showCover) {
            setControlsVisible(true)
        }
    }, [controls.playback?.showCover, controlsVisible])

    useEffect(() => {
        if (needPay) {
            setControlsVisible(false)
        }

    }, [needPay])

    const showControls = () => {
        if (!needPay) {
            setControlsVisible(true)
            reset()
        }
        else {
            setControlsVisible(false)
        }
    }



    const hideControls = () => {
        setControlsVisible(false)
    }

    useEffect(() => {
        const videoContainer = containerRef.current;
        if (!videoContainer) return;

        const handleShowControls = () => {
            if (isMobile) return;
            showControls();
        }

        videoContainer.addEventListener('mousemove', handleShowControls)
        if (!isMobile) {
            videoContainer.addEventListener('mousedown', handleShowControls)
        }

        return () => {
            videoContainer.removeEventListener('mousemove', handleShowControls)
            if (!isMobile) {
                videoContainer.removeEventListener('mousedown', handleShowControls)
            }
        }
    }, [isMobile, needPay])

    return { controlsVisible, showControls, hideControls };
}