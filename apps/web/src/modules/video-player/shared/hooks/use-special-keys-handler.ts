import { KeyboardEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TimelineControlsStore } from "../stores/timeline-store";
import { VolumeControlStore } from "../stores/volume-store";
import { PlaybackControlStore } from "../stores/playback-store";

type Controls = Partial<{
    timeline: TimelineControlsStore,
    volume: VolumeControlStore,
    playback: PlaybackControlStore
}>

export function useSpecialKeysHandler(controls: Controls) {
    const router = useRouter();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.code) {
            case 'Space':
                controls.playback?.togglePlay();
                return;
            case 'Escape':
                router.back()
                return;
            case 'ArrowUp':
                controls.volume?.changeVolume(5);
                return;
            case 'ArrowDown':
                controls.volume?.changeVolume(-5);
                return;
            case 'ArrowLeft':
                controls.timeline?.changeCurrentTime(-5);
                return;
            case 'ArrowRight':
                controls.timeline?.changeCurrentTime(5);
                return;
            case 'KeyM':
                controls.volume?.toggleMute();
                return;
            case 'KeyF':
                controls.playback?.toggleFullscreen();
                return;
            case 'KeyP':
                controls.playback?.togglePIP();
                return;
            default:
                break
        }

        const numberKey = Number(e.key);

        if (!Number.isNaN(numberKey)) {
            controls.timeline?.setCurrentTimePercentage(numberKey * 10)

            return
        }
    }, [controls]);

    return handleKeyDown;
}