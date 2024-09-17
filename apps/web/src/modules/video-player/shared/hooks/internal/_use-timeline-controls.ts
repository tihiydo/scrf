import { MutableRefObject, useEffect } from "react";
import { TimelineControlsStore } from "../../stores/timeline-store";


export function useTimelineControls(
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    controls?: TimelineControlsStore
) {
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !controls) return;

        const handleTimeUpdate = () => {
            const currentTime = Math.floor(video.currentTime);
            if (typeof currentTime === 'number' && !Number.isNaN(currentTime)) {
                controls.setCurrentTime(currentTime);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    })

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !controls || Math.floor(video.currentTime) === Math.floor(controls.currentTime)) return;
        video.currentTime = controls.currentTime;
    }, [controls?.currentTime])
}