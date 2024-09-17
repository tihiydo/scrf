import { createContext, useEffect } from "react";
import { VolumeControlStore } from "../../shared/stores/volume-store";
import { PlaybackControlStore } from "../../shared/stores/playback-store";
import { TimelineControlsStore } from "../../shared/stores/timeline-store";
import { LevelsControlsStore } from "../../shared/stores/levels-store";
import { AudioTrackControls } from "../../shared/stores/audio-tracks-store";
import { MediaInfoStore } from "../../shared/stores/media-info-store";
import { SubtitlesControlsStore } from "../../shared/stores/subtitles-store";
import { LiveStreamPlayerStore } from "../stores/live-stream-player-store";



export const LiveStreamPlayerContext = createContext({
    volumeControls: new VolumeControlStore(),
    playbackControls: new PlaybackControlStore(),
    timelineControls: new TimelineControlsStore(),
    levelsControls: new LevelsControlsStore(),
    audioTracksControls: new AudioTrackControls(),
    subtitlesControls: new SubtitlesControlsStore(),
    mediaControls: new MediaInfoStore(),
    liveStreamPlayerControls: new LiveStreamPlayerStore('', ''),
})


const volumeControlsStore = new VolumeControlStore();
const playbackControlsStore = new PlaybackControlStore();
const timelineControlsStore = new TimelineControlsStore();
const levelsControlsStore = new LevelsControlsStore();
const audioTracksControlsStore = new AudioTrackControls();
const subtitlesControlsStore = new SubtitlesControlsStore();
const mediaControls = new MediaInfoStore();

const liveStreamPlayerStore = new LiveStreamPlayerStore('', '')

type Props = {
    children: React.ReactNode;
    title: string;
    src: string;
}
export const LiveStreamPlayerProvider = ({ children, src, title }: Props) => {
    useEffect(() => {
        liveStreamPlayerStore.init({
            src, title
        })

        return () => {
            liveStreamPlayerStore.reset()

            audioTracksControlsStore.reset();
            playbackControlsStore.reset();
            timelineControlsStore.reset();
            levelsControlsStore.reset();
            volumeControlsStore.reset();
            mediaControls.reset();
            subtitlesControlsStore.reset();
        }
    }, [src, title]);

    return <LiveStreamPlayerContext.Provider
        value={{
            audioTracksControls: audioTracksControlsStore,
            levelsControls: levelsControlsStore,
            playbackControls: playbackControlsStore,
            subtitlesControls: subtitlesControlsStore,
            timelineControls: timelineControlsStore,
            volumeControls: volumeControlsStore,
            liveStreamPlayerControls: liveStreamPlayerStore,
            mediaControls: mediaControls,
        }}
    >
        {children}
    </LiveStreamPlayerContext.Provider>
} 