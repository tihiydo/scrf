import { MediaPlaylist } from "hls.js";
import { Resettable } from "..";
import { makeAutoObservable } from "mobx";


export type ActiveSubtitleTrack = number | 'off';

export class SubtitlesControlsStore implements Resettable {
    tracks: MediaPlaylist[];
    activeTrack: ActiveSubtitleTrack;

    constructor() {
        this.tracks = [];
        this.activeTrack = 'off'

        makeAutoObservable(this)
    }

    setSubtitles(subtitles: MediaPlaylist[]) {
        this.tracks = subtitles;
    }

    selectSubtitlesTrack(trackId: ActiveSubtitleTrack) {
        if (trackId === 'off') {
            return this.activeTrack = trackId
        }

        const trackData = this.tracks.find(track => {
            return track.id === trackId
        })

        if (trackData) {
            this.activeTrack = trackData.id
        }
    }

    getActiveSubtitleTrackName(): ExtendString<'off' | 'unknown'> {
        if (this.activeTrack === 'off') return 'off';

        return this.tracks.find(track => track.id === this.activeTrack)?.name ?? 'unknown';
    }

    reset() {
        this.tracks = [];
        this.activeTrack = 'off';
    }
}