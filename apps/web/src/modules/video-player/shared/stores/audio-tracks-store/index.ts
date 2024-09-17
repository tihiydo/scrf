import { MediaPlaylist } from "hls.js";
import { Resettable } from "..";
import { makeAutoObservable } from "mobx";


export class AudioTrackControls implements Resettable {
    tracks: MediaPlaylist[];
    activeTrackId: Maybe<number>;

    constructor() {
        this.tracks = [];
        this.activeTrackId = null;

        makeAutoObservable(this);
    }

    setAudioTracks(audioTracks: MediaPlaylist[]) {
        this.tracks = audioTracks;
    }
  
    setCurrentAudioTrack(audioTrack: Maybe<number>) {
        if (this.tracks.every(track => track.id !== audioTrack)) return;

        this.activeTrackId = audioTrack;
    }

    getActiveAudioName(): ExtendString<'unknown'> {
        if (typeof this.activeTrackId !== 'number') return 'unknown';

        return this.tracks.find(aud => aud.id === this.activeTrackId)?.name ?? 'unknown'
    }

    reset() {
        this.tracks = [];
        this.activeTrackId = null;
    }
}