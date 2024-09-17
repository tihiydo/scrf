// Store if paused, playbackRate, viewMode

import { makeAutoObservable } from "mobx";
import { Resettable } from "..";

export type PlaybackRate = 1 | 2 | 3;
export type ViewMode = 'PiP' | 'fullscreen' | null

export const playbackRateOptions: Array<{ value: PlaybackRate, name: React.ReactNode }> = [
    {
        name: 'Normal',
        value: 1
    },
    {
        name: 'Fast',
        value: 2
    },
    {
        name: 'Super Fast',
        value: 3
    },

] as const

export class PlaybackControlStore implements Resettable {
    paused: boolean;
    playbackRate: PlaybackRate;
    viewMode: ViewMode;
    showCover: boolean;
    airPlayEnabled: boolean;
    airPlayAvailable: boolean;

    constructor(initialData?: { viewMode?: ViewMode }) {
        this.paused = true;
        this.playbackRate = 1;
        this.viewMode = initialData?.viewMode ?? null;
        this.showCover = true;
        this.airPlayEnabled = false;
        this.airPlayAvailable = false;

        makeAutoObservable(this);
    }

    togglePlay() {
        this.paused = !this.paused
        this.showCover = false;
    }


    setPaused(paused: boolean) {
        this.paused = paused
        this.showCover = false;
    }

    setPlaybackRate(rate: PlaybackRate) {
        this.playbackRate = rate;
    }

    setViewMode(viewMode: ViewMode) {
        this.viewMode = viewMode
    }

    toggleFullscreen() {
        this.viewMode = this.viewMode === 'fullscreen' ? null : 'fullscreen'
    }

    togglePIP() {
        this.viewMode = this.viewMode === 'PiP' ? null : 'PiP'
    }

    toggleAirPlayEnabled(enabled?: boolean) {
        this.airPlayEnabled = typeof enabled === 'boolean' ? enabled : !this.airPlayEnabled
    }

    toggleAirPlayAvailable(enabled?: boolean) {
        this.airPlayAvailable = typeof enabled === 'boolean' ? enabled : !this.airPlayAvailable
    }

    reset() {
        this.paused = false;
        this.playbackRate = 1;
        this.viewMode = null;
        this.showCover = false;
    }
}