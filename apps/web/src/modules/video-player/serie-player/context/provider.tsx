import { createContext, useEffect } from "react";
import { VolumeControlStore } from "../../shared/stores/volume-store";
import { PlaybackControlStore } from "../../shared/stores/playback-store";
import { TimelineControlsStore } from "../../shared/stores/timeline-store";
import { LevelsControlsStore } from "../../shared/stores/levels-store";
import { AudioTrackControls } from "../../shared/stores/audio-tracks-store";
import { SubtitlesControlsStore } from "../../shared/stores/subtitles-store";
import { SeriePlayerStore } from "../stores/serie-player-store";
import { MediaInfoStore } from "../../shared/stores/media-info-store";
import { useSession } from "@/session/hooks/use-session";
import axios from "axios";
import https from 'https'
import { env } from "@/env";
import { sendAnalytics } from "../../shared/api/statistic";
import { isNativeMobileAppUser } from "../../shared/utils";



export const SeriePlayerContext = createContext({
    volumeControls: new VolumeControlStore(),
    playbackControls: new PlaybackControlStore({
    }),
    timelineControls: new TimelineControlsStore(),
    levelsControls: new LevelsControlsStore(),
    audioTracksControls: new AudioTrackControls(),
    subtitlesControls: new SubtitlesControlsStore(),
    mediaInfoStore: new MediaInfoStore(),
    seriePlayerControls: new SeriePlayerStore('', '', '', ''),
})


const volumeControlsStore = new VolumeControlStore();
const playbackControlsStore = new PlaybackControlStore({
});
const timelineControlsStore = new TimelineControlsStore();
const levelsControlsStore = new LevelsControlsStore();
const audioTracksControlsStore = new AudioTrackControls();
const subtitlesControlsStore = new SubtitlesControlsStore();
const mediaInfoStore = new MediaInfoStore();

const seriePlayerStore = new SeriePlayerStore('', '', '', '')

type Props = {
    children: React.ReactNode;
    title: string;
    src: string;
    serialImdbid: string;
    episodeImdbid: string;
}
export const SeriePlayerProvider = ({ children, serialImdbid, episodeImdbid, src, title }: Props) => {
    useEffect(() => {
        seriePlayerStore.init({
            title, src, serialImdbid, episodeImdbid
        })

        return () => {

            seriePlayerStore.reset()
            audioTracksControlsStore.reset();
            playbackControlsStore.reset();
            timelineControlsStore.reset();
            levelsControlsStore.reset();
            volumeControlsStore.reset();
            subtitlesControlsStore.reset();
            mediaInfoStore.reset();

        }
    }, [src, title, serialImdbid, episodeImdbid]);

    return <SeriePlayerContext.Provider
        value={{
            audioTracksControls: audioTracksControlsStore,
            levelsControls: levelsControlsStore,
            playbackControls: playbackControlsStore,
            subtitlesControls: subtitlesControlsStore,
            timelineControls: timelineControlsStore,
            volumeControls: volumeControlsStore,
            seriePlayerControls: seriePlayerStore,
            mediaInfoStore: mediaInfoStore,
        }}
    >
        {children}
    </SeriePlayerContext.Provider>
} 