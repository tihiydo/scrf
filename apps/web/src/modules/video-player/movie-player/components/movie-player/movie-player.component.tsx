import styles from './movie-player.module.scss';
import { AnimatePresence, motion } from 'framer-motion'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { ProgressBar } from '../../../shared/components/progress-bar';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '../video';
import { useMediaQuery } from '@uidotdev/usehooks';
import { BuySubscription } from '../../../shared/components/buy-subscription';
import { PlayerEvents } from '../../../types/events';
import { HlsConfig } from 'hls.js';
import { ShadowBottom, ShadowTop } from '../../../shared/components/shadows';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { CoverScreen } from '../../../shared/components/cover-screen';
import { Volume } from '../../../shared/components/volume';
import { PlayBtn } from '../../../shared/components/play-btn';
import { PlaybackRate } from '../../../shared/components/playback-rate';
import { PictureInPicture } from '../../../shared/components/picture-in-picture';
import { ViewMode } from '../../../shared/components/view-mode';
import { Subtitles } from '../../../shared/components/subtitles';
import { AudioTracks } from '../../../shared/components/audio-tracks';
import { LevelsSelect } from '../../../shared/components/level-select';
import { CurrentTime } from '../../../shared/components/current-time';
import { useMoviePlayer } from '../../context';
import { Controls } from '../controls';
import { useControlsVisible } from '@/modules/video-player/shared/hooks/use-controls-visible';
import EventCapture from '../../event-capture.component';
import { LoadingIcon } from '@/components/icons/loading-icon';
import { Airplay } from '@/modules/video-player/shared/components/airplay';
import { watchAccessStore } from '@/modules/video-player/shared/stores/watch-access-store'
import { isNativeMobileAppUser } from '@/modules/video-player/shared/utils';
import { useSession } from '@/session/hooks/use-session';
import { useAnalytics } from '@/modules/video-player/shared/hooks/use-analytics';
import Settings from '@/modules/video-player/shared/components/settings/settings.component';
import { useModalManager } from '@/hooks/use-modal-manager';
import { SettingsPages } from '@/modules/video-player/shared/constants';
import { MobileSettings } from '@/modules/video-player/shared/components/mobile-settings';
import { CenterControls } from '@/modules/video-player/shared/components/center-controls';
import { useClickStreakHandler } from '@/hooks/use-click-streak-handler';
import { ClickArea } from '@/modules/video-player/shared/components/click-area';
import PlayerMessage from '@/modules/video-player/shared/components/player-message/player-message.component';

type Props = {
    hlsConfig: Partial<HlsConfig>
    title: string;
    src: string;
    coverImg: string;
    containerRef?: RefObject<HTMLDivElement>
    analytics?: boolean
    autorotate?: boolean;
} & PlayerEvents



const MoviePlayer = ({ onPlayChange, onTimeChange, onViewModeChange, hlsConfig, title, src, coverImg, containerRef: containerExternalRef, analytics, autorotate }: Props) => {
    const { audioTracksControls, levelsControls, playbackControls, subtitlesControls, timelineControls, volumeControls, mediaInfoControls, moviePlayerControls } = useMoviePlayer()
    const containerInnerRef = useRef<HTMLDivElement>(null)
    const containerRef = containerExternalRef ?? containerInnerRef;
    const router = useRouter();
    const [needPay, setNeedPay] = useState(false)
    const { controlsVisible: interactionActive, showControls, hideControls } = useControlsVisible(containerRef, needPay, {
        playback: playbackControls
    });
    const isNotDesktop = useMediaQuery('screen and (max-width: 1024px');
    const modalManager = useModalManager<SettingsPages>();

    const realControlsVisible = interactionActive && watchAccessStore.isGranted;


    const isAppUser = isNativeMobileAppUser(window?.navigator?.userAgent)

    const session = useSession();

    useAnalytics({
        data: {
            type: 'movie',
            imdbid: moviePlayerControls.imdbid,
            audiolang: audioTracksControls.getActiveAudioName(),
            subslang: subtitlesControls.getActiveSubtitleTrackName(),
            userid: session.user?.id ?? 'unknown',
            country: 'NL',
        },
        analyticsEnabled: analytics
    })


    return (
        <>


            <EventCapture
                onTimeChange={onTimeChange}
                onPlayChange={onPlayChange}
                onViewModeChange={onViewModeChange}
            />

            <div className={styles.player}>
                <div style={{ zIndex: 20 }}>
                    <MobileSettings
                        controls={modalManager}
                        stores={{
                            playback: playbackControls,
                            quality: levelsControls,
                            audio: audioTracksControls,
                            subtitles: subtitlesControls
                        }}
                    />
                </div>
                <div className={styles.playerVideo}>
                    <Video
                        hlsConfig={hlsConfig}
                        src={src}
                        needPay={needPay}
                        setNeedPay={setNeedPay}
                        autorotate={autorotate}
                    />

                    {playbackControls.showCover || watchAccessStore.access !== 'granted' || needPay ? (
                        <CoverScreen needPay={needPay} coverImage={coverImg} onClick={() => playbackControls.setPaused(false)} />
                    ) : null}

                    <AnimatePresence>
                        {realControlsVisible ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: .4 }}
                            >

                                <ShadowTop />
                                <ShadowBottom />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {mediaInfoControls.manifestState !== 'parsed' && mediaInfoControls.manifestState !== 'loaded' ? (
                        <div className={styles.loading}>
                            <LoadingIcon className={styles.loadingIcon} />
                        </div>
                    ) : null}

                    <Controls
                        containerRef={containerRef}
                        showControls={showControls}
                        hideControls={hideControls}
                        needPay={needPay}
                        visible={realControlsVisible}
                    >
                        {isNotDesktop ? (
                            <ClickArea
                                onSingleClick={() => {
                                    console.log(interactionActive)
                                    if (interactionActive) {
                                        hideControls();
                                    } else {
                                        showControls();
                                    }
                                }}
                                onSkip={() => {
                                    timelineControls.changeCurrentTime(10)
                                }}
                                onRewind={() => {
                                    timelineControls.changeCurrentTime(-10)
                                }}
                            />
                        ) : null}


                        {isNotDesktop ? (
                            <AnimatePresence>
                                {interactionActive ? (
                                    <motion.div
                                        animate={{
                                            opacity: 1,
                                        }}
                                        initial={{
                                            opacity: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                    >
                                        <CenterControls>
                                            <PlayBtn
                                                paused={playbackControls.paused}
                                                onClick={() => {
                                                    playbackControls.togglePlay()
                                                }}
                                            />
                                        </CenterControls>
                                    </motion.div>
                                ) : (
                                    null
                                )}
                            </AnimatePresence>
                        ) : null}

                        <AnimatePresence>
                            {interactionActive || watchAccessStore.access === 'denied' ? (
                                <motion.div
                                    className={styles.top}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: .3 }}
                                >

                                    {isAppUser ? (
                                        <button
                                            className={styles.titleBlock}
                                            onClick={() => {
                                                // @ts-expect-error
                                                window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'BACK_BUTTON_PRESSED' }));
                                            }}
                                        >
                                            <div
                                                className={styles.goBack}
                                            >
                                                <ChevronLeftIcon className={styles.goBackIcon} />
                                            </div>

                                            <h2 className={styles.titleBlockTitle}>
                                                {title}
                                            </h2>
                                        </button>
                                    ) : (
                                        <div className={styles.titleBlock}>
                                            <Button
                                                className={styles.goBack}
                                                variant={'ghost'}
                                                size={'icon'}
                                                onClick={() => {
                                                    router.push(`/movie/${moviePlayerControls.imdbid}`)
                                                }}
                                            >
                                                <ChevronLeftIcon className={styles.goBackIcon} />
                                            </Button>

                                            <h2 className={styles.titleBlockTitle}>
                                                {title}
                                            </h2>
                                        </div>
                                    )}

                                    {watchAccessStore.isGranted ? (
                                        <div className={styles.topRight}>


                                            {isNotDesktop ? (
                                                <>
                                                    <PictureInPicture
                                                        enabled={playbackControls.viewMode === 'PiP'}
                                                        onClick={() => {
                                                            playbackControls.togglePIP()
                                                        }}
                                                    />

                                                    <Settings
                                                        className={styles.settings}
                                                        onClick={() => {
                                                            modalManager.openModal(SettingsPages.Main)
                                                        }}
                                                    />
                                                </>
                                            ) : <>
                                                <AudioTracks
                                                    selectedTrack={audioTracksControls.activeTrackId}
                                                    tracks={audioTracksControls.tracks}
                                                    onChange={value => {
                                                        audioTracksControls.setCurrentAudioTrack(value);
                                                    }}
                                                />
                                                <LevelsSelect
                                                    levels={levelsControls.resolutions}
                                                    activeType={levelsControls.activeOption.type}
                                                    onChange={(value) => {
                                                        levelsControls.setResolutionOption(value);
                                                    }}

                                                />
                                            </>}
                                        </div>
                                    ) : null}
                                </motion.div>

                            ) : null}
                        </AnimatePresence>

                        <AnimatePresence>
                            {realControlsVisible ? (
                                <motion.div
                                    className={styles.bottom}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: .3 }}
                                >
                                    <div className={styles.bottomControls}>
                                        <div className={styles.bottomControlsLeft}>
                                            {isNotDesktop ? (
                                                <>

                                                </>
                                            ) : <>
                                                <PlayBtn
                                                    paused={playbackControls.paused}
                                                    onClick={() => {
                                                        playbackControls.togglePlay()
                                                    }}
                                                />

                                                {(isAppUser) ? (
                                                    null
                                                ) : (
                                                    <Volume
                                                        isMuted={volumeControls.muted}
                                                        volume={volumeControls.value}
                                                        onClick={() => {
                                                            volumeControls.toggleMute()
                                                        }}
                                                        onChange={(newVolume) => {
                                                            volumeControls.setVolume(newVolume);
                                                        }}
                                                    />
                                                )}
                                            </>
                                            }

                                            <CurrentTime
                                                isLoading={typeof timelineControls.duration !== 'number' || timelineControls.duration <= 0}
                                                currentTime={timelineControls.currentTime}
                                                duration={timelineControls.duration}
                                            />
                                        </div>

                                        <div className={styles.bottomControlsRight}>
                                            {isNotDesktop ? (
                                                <>

                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        playbackControls.airPlayAvailable ? (
                                                            <Airplay
                                                                onClick={() => {
                                                                    playbackControls.toggleAirPlayEnabled()
                                                                }}
                                                            />
                                                        ) : null
                                                    }

                                                    <Subtitles
                                                        tracks={subtitlesControls.tracks}
                                                        selectedSubtitle={subtitlesControls.activeTrack}
                                                        onChange={(selected) => {
                                                            subtitlesControls.selectSubtitlesTrack(selected);
                                                        }}
                                                    />

                                                    <PlaybackRate
                                                        playbackRate={playbackControls.playbackRate}
                                                        onChange={(rate) => {
                                                            playbackControls.setPlaybackRate(rate);
                                                        }}
                                                    />

                                                    <PictureInPicture
                                                        enabled={playbackControls.viewMode === 'PiP'}
                                                        onClick={() => {
                                                            playbackControls.togglePIP()
                                                        }}
                                                    />
                                                </>
                                            )}




                                            {isAppUser ? (
                                                null
                                            ) : (
                                                <ViewMode
                                                    isFullscreen={playbackControls.viewMode === 'fullscreen'}
                                                    onClick={() => {
                                                        playbackControls.toggleFullscreen();
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <ProgressBar
                                            continuousBuffered={timelineControls.buffered}
                                            currentTime={timelineControls.currentTime}
                                            duration={timelineControls.duration}
                                            onBeforeChange={() => {
                                                playbackControls.setPaused(true)
                                            }}
                                            onAfterChange={(value) => {
                                                playbackControls.setPaused(false)
                                                timelineControls.setCurrentTime(value);
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                null
                            )}
                        </AnimatePresence>
                    </Controls>

                </div>
            </div>
        </>
    )
}

export default observer(MoviePlayer)