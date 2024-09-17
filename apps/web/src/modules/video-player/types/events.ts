import { ViewMode } from "../shared/stores/playback-store";

export type PlayerEvents = {
    onTimeChange?: (currentTime: number, runtime: { bufferedTill: number, duration: number }) => void;
    onPlayChange?: (isPlaying: boolean) => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
}