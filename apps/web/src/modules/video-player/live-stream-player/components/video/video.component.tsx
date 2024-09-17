import { Dispatch, SetStateAction } from "react";
import styles from './video.module.scss';
import { observer } from "mobx-react-lite";
import HLSVideo from "@/components/hls-video/hls-video.component";
import { HlsConfig } from "hls.js";
import { motion } from "framer-motion"; // Импортируем motion из framer-motion
import { useLiveStreamPlayer } from "../../context";
import { formatResolutions } from "@/modules/video-player/utils/resolution";
import { useGenericVideoRef } from "@/modules/video-player/shared/hooks/use-generic-video-ref";
import { watchAccessStore } from "@/modules/video-player/shared/stores/watch-access-store";
import { Loader } from "lucide-react";

type Props = {
    src: string;
    setNeedPay: Dispatch<SetStateAction<boolean>>;
    needPay: boolean;
    hlsConfig: Partial<HlsConfig>
    autorotate?: boolean
    onPlay?: () => void;  // Add this line
};

const Video = observer(({ src, setNeedPay, needPay, hlsConfig, autorotate }: Props) => {
    const { audioTracksControls, subtitlesControls, levelsControls, mediaControls, timelineControls, playbackControls, volumeControls, liveStreamPlayerControls } = useLiveStreamPlayer();
    const playerRef = useGenericVideoRef({
        controls: {
            playback: playbackControls,
            timeline: timelineControls,
            volume: volumeControls,
            mediaInfo: mediaControls,
        },
        setNeedPay,
        autorotate
    });

    return (
        <div className={styles.container}>

            <Loader size={24} />
            {/* Используем motion.div для анимации opacity */}
            <motion.div
                className={styles.videoContainer}
                initial={{ opacity: 1 }} // начальное значение opacity
                animate={{ opacity: needPay ? 0 : 1 }} // анимация opacity в зависимости от needPay
                transition={{ duration: 15 }} // продолжительность анимации
            >
                <HLSVideo
                    access={watchAccessStore.access}
                    airPlayShareEnabled={playbackControls.airPlayEnabled}
                    needPay={needPay}
                    config={{
                        liveSyncDurationCount: 3,  // Number of segments to keep as buffer
                        liveMaxLatencyDurationCount: 10,  // Maximum latency duration in number of segments
                        enableWorker: true,  // Enable the HLS.js worker to offload processing
                        lowLatencyMode: true,  // Enable low latency mode
                        maxLiveSyncPlaybackRate: 1.2,  // Allow faster playback to catch up with the live stream
                        ...hlsConfig
                    }}
                    playerRef={playerRef}
                    className={styles.video}
                    onLoadedMetadata={() => {
                        if (!Number.isNaN(playerRef.current?.duration)) {
                            timelineControls.setDuration(Math.floor(playerRef.current?.duration!))
                        }
                    }}
                    onLevelUpdated={({ details }) => {
                        // console.log(details)
                        liveStreamPlayerControls.setIsLive(details.live)
                    }}
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
                    onManifestLoaded={() => {
                        mediaControls.setManifestState('loaded')
                    }}
                    onManifestLoading={() => {
                        mediaControls.setManifestState('loading')
                    }}
                    onHlsError={(data) => {
                        mediaControls.setManifestState('error')
                    }}
                    onResulutionSwitching={(data) => {
                    }}
                    onResulutionSwitch={({ level }) => {
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
                    onManifestParsed={async ({ levels, }, hls) => {
                        mediaControls.setManifestState('parsed')
                        // audioTracks.forEach((audioTrack, index) => {
                        //     console.log(`audiotrack ${index + 1}`, audioTrack)
                        // })

                        // subtitleTracks.forEach((subtitleTrack, index) => {
                        //     console.log(`subtitleTrack ${index + 1}`, subtitleTrack)
                        // })



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
