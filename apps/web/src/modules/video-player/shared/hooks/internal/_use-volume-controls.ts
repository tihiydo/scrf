import { MutableRefObject, useEffect } from "react";
import { VolumeControlStore } from "../../stores/volume-store";


export function useVolumeControls(
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    controls?: VolumeControlStore
) {
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !controls) return;

        video.volume = controls.value / 100;
        video.muted = controls.muted;
    }, [controls?.value, controls?.muted])
}