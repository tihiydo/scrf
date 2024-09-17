'use client'

import { ComponentProps, MutableRefObject, RefObject, useEffect, useState } from 'react'
import Hls, { AudioTrackLoadedData, AudioTrackSwitchedData, AudioTracksUpdatedData, ErrorData, FragBufferedData, FragLoadedData, FragLoadingData, HlsConfig, LevelSwitchedData, LevelSwitchingData, LevelUpdatedData, LevelsUpdatedData, ManifestLoadedData, ManifestLoadingData, ManifestParsedData, SubtitleTrackSwitchData } from "hls.js";

type Props = {
    needPay: boolean
    src: string;
    access?: 'idle' | 'granted' | 'denied';
    playerRef: RefObject<HTMLVideoElement> | MutableRefObject<HTMLVideoElement>
    config?: Partial<HlsConfig>
    audioTrackId?: Maybe<number>;
    activeLevel?: Maybe<number>;
    subtitleTrack?: Maybe<number>;

    airPlayShareEnabled?: boolean;

    onHlsError?: (data: ErrorData) => void;

    // Audio tracks
    onAudioTrackLoaded?: (data: AudioTrackLoadedData) => void;
    onAudioTracksUpdated?: (data: AudioTracksUpdatedData) => void;
    onAudioTrackSwitched?: (data: AudioTrackSwitchedData) => void;

    // Levels
    onResolutionsUpdated?: (data: LevelsUpdatedData) => void;
    onLevelUpdated?: (data: LevelUpdatedData) => void;
    onResulutionSwitch?: (data: LevelSwitchedData) => void;
    onResulutionSwitching?: (data: LevelSwitchingData) => void;

    // Subtitle tracks
    onSubtitleTrackSwitch?: (data: SubtitleTrackSwitchData) => void;

    // Fragments
    onFragmentBuffered?: (data: FragBufferedData) => void;
    onFragmentLoaded?: (data: FragLoadedData) => void;
    onFragmentLoading?: (data: FragLoadingData) => void;

    // Manifest
    onManifestLoading?: (data: ManifestLoadingData) => void;
    onManifestLoaded?: (data: ManifestLoadedData) => void;
    onManifestParsed?: (data: ManifestParsedData, hls: Hls) => void;
} & ComponentProps<'video'>

const HLSVideo = ({
    needPay,
    config,
    src,
    playerRef,
    onAudioTrackLoaded,
    onAudioTracksUpdated,
    onAudioTrackSwitched,
    onResolutionsUpdated,
    onResulutionSwitch,
    onLevelUpdated: onResolutionUpdated,
    onResulutionSwitching,
    onManifestLoaded,
    onSubtitleTrackSwitch,
    onFragmentBuffered,
    onFragmentLoaded,
    onFragmentLoading,
    onManifestParsed,
    onManifestLoading,
    onHlsError,
    audioTrackId,
    activeLevel,
    subtitleTrack,
    access = 'granted',
    airPlayShareEnabled = false,
    ...props
}: Props) => {
    const [hls, setHls] = useState<Hls>()

    useEffect(() => {
        let hls: Hls;

        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            const newHls = new Hls({
                enableWorker: false,
                ...config,
            });


            if (playerRef.current !== null) {
                newHls.attachMedia(playerRef.current);
            }

            if (access === 'denied') {
                return newHls.destroy();
            }

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                if (access === 'granted') {
                    newHls.loadSource(src);
                }


                newHls.on(Hls.Events.MANIFEST_LOADING, (_e, data) => onManifestLoading?.(data))
                newHls.on(Hls.Events.MANIFEST_LOADED, (_e, data) => onManifestLoaded?.(data))
                newHls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
                    newHls.subtitleDisplay = false;
                    newHls.on(Hls.Events.AUDIO_TRACK_LOADED, (_e, data) => onAudioTrackLoaded?.(data))
                    newHls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_e, data) => onAudioTracksUpdated?.(data))
                    newHls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_e, data) => onAudioTrackSwitched?.(data))

                    newHls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => onResulutionSwitch?.(data))
                    newHls.on(Hls.Events.LEVEL_SWITCHING, (_e, data) => onResulutionSwitching?.(data))
                    newHls.on(Hls.Events.LEVELS_UPDATED, (_e, data) => onResolutionsUpdated?.(data))
                    newHls.on(Hls.Events.LEVEL_UPDATED, (_e, data) => onResolutionUpdated?.(data))

                    newHls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (_e, data) => onSubtitleTrackSwitch?.(data))

                    newHls.on(Hls.Events.FRAG_BUFFERED, (_e, data) => onFragmentBuffered?.(data))
                    newHls.on(Hls.Events.FRAG_LOADED, (_e, data) => onFragmentLoaded?.(data))
                    newHls.on(Hls.Events.FRAG_LOADING, (_e, data) => onFragmentLoading?.(data))

                    onManifestParsed?.(data, hls)
                });
            });

            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    onHlsError?.(data);
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            }
            );

            hls = newHls;
            setHls(hls)
        }

        if (Hls.isSupported()) {
            _initPlayer();
        }

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [src, access])

    useEffect(() => {
        if (!playerRef.current) return;

        const player = playerRef.current;
        if (airPlayShareEnabled) {

            player.src = src; // Set the video source
            player.disableRemotePlayback = false; // Ensure remote playback is enabled

            // Force the video to load the new source
            player.load();

            // Ensure the video starts playing
            player.play().catch(error => {
                console.error('Error starting playback:', error);
            });
        }
    }, [airPlayShareEnabled, src]);

    useEffect(() => {
        const activeAudio = hls?.audioTracks.find(audio => {
            return audio.id === audioTrackId;
        })

        if (activeAudio) {
            hls?.setAudioOption(activeAudio)
        }
    }, [audioTrackId])


    useEffect(() => {
        if (!hls) return;
        hls.nextLevel = activeLevel ?? -1
    }, [activeLevel])


    useEffect(() => {
        if (!hls) return;
        if (typeof subtitleTrack === 'number') {
            hls.subtitleTrack = subtitleTrack
            hls.subtitleDisplay = true
        } else {
            hls.subtitleDisplay = false
        }

    }, [subtitleTrack])

    const handleKeyDown = (event: any) => {
        if (needPay) {
            event.preventDefault();
        }
    };


    useEffect(() => {
        if (!hls) return;

        if (needPay) {
            hls.pauseBuffering()
            hls.stopLoad()

            setTimeout(() => {
                // hlsRef.current.stopLoad()
                hls.destroy()
            }, 15200)
        }

    }, [needPay])

    return (
        <video
            ref={playerRef}
            onKeyDown={handleKeyDown}
            playsInline
            {...props}
        />
    )
}

export default HLSVideo