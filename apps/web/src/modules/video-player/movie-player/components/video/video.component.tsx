import { Dispatch, SetStateAction, useEffect } from "react";
import styles from './video.module.scss';
import { observer } from "mobx-react-lite";
import HLSVideo from "@/components/hls-video/hls-video.component";
import { HlsConfig } from "hls.js";
import { motion } from "framer-motion"; // Импортируем motion из framer-motion
import { GetSubtitleTracks } from "@/entities/subtitle-track/requests/get-tracks";
import { GetAudioTracks } from "@/entities/audio-track/requests/get-tracks";
import { useMoviePlayer } from "../../context";
import { matchAudioTracksName, matchSubtitleTracksName } from "@/modules/video-player/utils/media-items";
import { formatResolutions } from "@/modules/video-player/utils/resolution";
import { useGenericVideoRef } from "@/modules/video-player/shared/hooks/use-generic-video-ref";
import { watchAccessStore } from "@/modules/video-player/shared/stores/watch-access-store";

type Props = {
    src: string;
    setNeedPay: Dispatch<SetStateAction<boolean>>;
    needPay: boolean;
    hlsConfig: Partial<HlsConfig>
    autorotate?: boolean;
};

const Video = observer(({ src, setNeedPay, needPay, hlsConfig, autorotate }: Props) => {
    const { audioTracksControls, subtitlesControls, levelsControls, moviePlayerControls, timelineControls, playbackControls, volumeControls, mediaInfoControls } = useMoviePlayer();
    const playerRef = useGenericVideoRef({
        controls: {
            playback: playbackControls,
            timeline: timelineControls,
            volume: volumeControls,
            mediaInfo: mediaInfoControls
        },
        setNeedPay,
        autorotate: autorotate ?? false
    });



    return (
        <div className={styles.container}>
            {/* Используем motion.div для анимации opacity */}
            <motion.div
                className={styles.videoContainer}
                initial={{ opacity: 1 }} // начальное значение opacity
                animate={{ opacity: needPay ? 0 : 1 }} // анимация opacity в зависимости от needPay
                transition={{ duration: 15 }} // продолжительность анимации
            >
                <HLSVideo
                    access={watchAccessStore.access}
                    needPay={needPay}
                    config={hlsConfig}
                    playerRef={playerRef}
                    className={styles.video}
                    onLoadedMetadata={() => {
                        if (!Number.isNaN(playerRef.current?.duration)) {
                            timelineControls.setDuration(Math.floor(playerRef.current?.duration!))
                        }
                    }}
                    airPlayShareEnabled={playbackControls.airPlayEnabled}
                    audioTrackId={audioTracksControls.activeTrackId}
                    activeLevel={levelsControls.activeOption.level}
                    subtitleTrack={subtitlesControls.activeTrack === 'off'
                        ? null
                        : subtitlesControls.activeTrack
                    }
                    onAudioTracksUpdated={async ({ audioTracks }) => {
                        // const dbAudioTracksResponse = await GetAudioTracks.clientFetch({
                        //     imdbid: playerStore.imdbid
                        // })

                        // playerStore.setAudioTracks(matchAudioTracksName(audioTracks, dbAudioTracksResponse.data));
                    }}
                    onAudioTrackSwitched={(data) => {
                        audioTracksControls.setCurrentAudioTrack(data.id)
                    }}
                    onResulutionSwitching={(data) => {
                    }}
                    onResulutionSwitch={({ level }) => {
                    }}
                    onHlsError={() => {
                        mediaInfoControls.setManifestState('error')
                    }}
                    onManifestLoaded={() => {
                        mediaInfoControls.setManifestState('loaded')
                    }}
                    onFragmentBuffered={async (fragment) => {
                        const video = playerRef.current;
                        if (!video) return;

                        const buffered = video.buffered;
                        const currentTime = video.currentTime;
                        let maxBufferedEnd = 0;

                        // Iterate over buffered ranges
                        for (let i = 0; i < buffered.length; i++) {
                            // Update maxBufferedEnd to the furthest buffered point
                            maxBufferedEnd = Math.max(maxBufferedEnd, buffered.end(i));
                        }

                        // Check for continuous buffering from currentTime to maxBufferedEnd
                        let continuousBuffering = true;
                        for (let i = 0; i < buffered.length; i++) {
                            if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                                while (i < buffered.length - 1 && buffered.end(i) >= buffered.start(i + 1)) {
                                    i++;
                                }
                                continuousBuffering = buffered.end(i) >= maxBufferedEnd;
                                break;
                            }
                        }
                        // Update bufferedTillSecond if continuous buffering is confirmed
                        if (continuousBuffering) {
                            timelineControls.setBufferedTillSecond(maxBufferedEnd);
                        }
                    }}
                    onManifestParsed={async ({ levels, audioTracks, subtitleTracks }) => {
                        mediaInfoControls.setManifestState('parsed')

                        // audioTracks.forEach((audioTrack, index) => {
                        //     console.log(`audiotrack ${index + 1}`, audioTrack)
                        // })

                        // subtitleTracks.forEach((subtitleTrack, index) => {
                        //     console.log(`subtitleTrack ${index + 1}`, subtitleTrack)
                        // })

                        try {
                            const dbSubtitlesResponse = await GetSubtitleTracks.clientFetch({
                                imdbid: moviePlayerControls.imdbid
                            })

                            const playlists = matchSubtitleTracksName(subtitleTracks, dbSubtitlesResponse.data);
                            subtitlesControls.setSubtitles(playlists);
                        } catch (error) {
                            console.log('Subtitles tracks failed', error)
                            subtitlesControls.setSubtitles(matchSubtitleTracksName(subtitleTracks, []));
                        }

                        try {
                            const dbAudioTracksResponse = await GetAudioTracks.clientFetch({
                                imdbid: moviePlayerControls.imdbid
                            })

                            const playlists = matchAudioTracksName(audioTracks, dbAudioTracksResponse.data);
                            audioTracksControls.setAudioTracks(playlists);
                            audioTracksControls.setCurrentAudioTrack(playlists[0]?.id);
                        } catch (error) {
                            console.log('Audio tracks failed', error)
                            audioTracksControls.setAudioTracks(matchAudioTracksName(audioTracks, []));
                        }

                        const formattedResolutions = formatResolutions(levels);
                        levelsControls.setResolutions(formattedResolutions);
                    }}
                    src={src}

                />
            </motion.div>
        </div>
    );
});

export default Video;
