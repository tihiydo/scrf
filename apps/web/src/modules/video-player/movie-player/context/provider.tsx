import { createContext, useEffect } from "react";
import { VolumeControlStore } from "../../shared/stores/volume-store";
import { PlaybackControlStore } from "../../shared/stores/playback-store";
import { TimelineControlsStore } from "../../shared/stores/timeline-store";
import { LevelsControlsStore } from "../../shared/stores/levels-store";
import { AudioTrackControls } from "../../shared/stores/audio-tracks-store";
import { SubtitlesControlsStore } from "../../shared/stores/subtitles-store";
import { MoviePlayerStore } from "../stores/movie-player-store";
import { MediaInfoStore } from "../../shared/stores/media-info-store";
import { useSession } from "@/session/hooks/use-session";
import { sendAnalytics } from "../../shared/api/statistic";
import { isNativeMobileAppUser } from "../../shared/utils";




export const MoviePlayerContext = createContext({
    volumeControls: new VolumeControlStore(),
    playbackControls: new PlaybackControlStore({
    }),
    timelineControls: new TimelineControlsStore(),
    levelsControls: new LevelsControlsStore(),
    audioTracksControls: new AudioTrackControls(),
    subtitlesControls: new SubtitlesControlsStore(),
    mediaInfoControls: new MediaInfoStore(),
    moviePlayerControls: new MoviePlayerStore('', '', ''),
})

const mediaInfoStore = new MediaInfoStore();
const volumeControlsStore = new VolumeControlStore();
const playbackControlsStore = new PlaybackControlStore({
});
const timelineControlsStore = new TimelineControlsStore();
const levelsControlsStore = new LevelsControlsStore();
const audioTracksControlsStore = new AudioTrackControls();
const subtitlesControlsStore = new SubtitlesControlsStore();

const moviePlayerStore = new MoviePlayerStore('', '', '')

type Props = {
    children: React.ReactNode;
    title: string;
    src: string;
    imdbid: string;
}
export const MoviePlayerProvider = ({ children, imdbid, src, title }: Props) => {
    useEffect(() => {
        moviePlayerStore.init({
            title, src, imdbid
        })

      
        return () => {
            moviePlayerStore.reset()
            audioTracksControlsStore.reset();
            mediaInfoStore.reset();
            playbackControlsStore.reset();
            timelineControlsStore.reset();
            levelsControlsStore.reset();
            volumeControlsStore.reset();
            subtitlesControlsStore.reset();
        }
    }, [src, title, imdbid]);

    return <MoviePlayerContext.Provider
        value={{
            audioTracksControls: audioTracksControlsStore,
            levelsControls: levelsControlsStore,
            playbackControls: playbackControlsStore,
            subtitlesControls: subtitlesControlsStore,
            timelineControls: timelineControlsStore,
            volumeControls: volumeControlsStore,
            moviePlayerControls: moviePlayerStore,
            mediaInfoControls: mediaInfoStore
        }
        }
    >
        {children}
    </MoviePlayerContext.Provider>
} 