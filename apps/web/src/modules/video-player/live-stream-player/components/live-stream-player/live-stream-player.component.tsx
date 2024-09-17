import styles from './styles.module.scss';
import { AnimatePresence, motion } from 'framer-motion'
import { RefObject, useRef, useState } from 'react'
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
import { LevelsSelect } from '../../../shared/components/level-select';
import { useLiveStreamPlayer } from '../../context';
import { Controls } from '../controls';
import { useControlsVisible } from '@/modules/video-player/shared/hooks/use-controls-visible';
import EventCapture from '../../event-capture.component';
import { IsLive } from '../is-live';
import { Airplay } from '@/modules/video-player/shared/components/airplay';
import Script from 'next/script';
import { Loader } from 'lucide-react';
import { MobileSettings } from '@/modules/video-player/shared/components/mobile-settings';
import { SettingsPages } from '@/modules/video-player/shared/constants';
import { useModalManager } from '@/hooks/use-modal-manager';
import { CenterControls } from '@/modules/video-player/shared/components/center-controls';
import Settings from '@/modules/video-player/shared/components/settings/settings.component';
import { ClickArea } from '@/modules/video-player/shared/components/click-area';
import { watchAccessStore } from '@/modules/video-player/shared/stores/watch-access-store';


type Props = {
    hlsConfig: Partial<HlsConfig>
    title: string;
    src: string;
    coverImg: string;
    containerRef?: RefObject<HTMLDivElement>
    autorotate?: boolean
} & PlayerEvents

const LiveStreamPlayer = ({ onPlayChange, onViewModeChange, hlsConfig, title, src, coverImg, containerRef: containerExternalRef, autorotate }: Props) => {

    const { levelsControls, playbackControls, subtitlesControls, volumeControls, liveStreamPlayerControls } = useLiveStreamPlayer()
    const containerInnerRef = useRef<HTMLDivElement>(null)
    const containerRef = containerExternalRef ?? containerInnerRef;
    const [needPay, setNeedPay] = useState(false)
    const { controlsVisible, showControls, hideControls } = useControlsVisible(containerRef, needPay, {
        playback: playbackControls
    });
    const isNotDesktop = useMediaQuery('screen and (max-width: 1024px');
    const modalManager = useModalManager<SettingsPages>();

    return (
        <>
            <EventCapture
                onViewModeChange={onViewModeChange}
                onPlayChange={onPlayChange}
            />
            <div className={styles.player}>
                <div style={{ zIndex: 20 }}>
                    <MobileSettings
                        controls={modalManager}
                        stores={{
                            playback: playbackControls,
                            quality: levelsControls,
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


                    {playbackControls.showCover || needPay || watchAccessStore.access !== 'granted' ? (
                        <CoverScreen needPay={needPay} coverImage={coverImg} onClick={() => playbackControls.setPaused(false)} />
                    ) : null}
                    <AnimatePresence>
                        {controlsVisible ? (
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


                    <Controls
                        containerRef={containerRef}
                        showControls={showControls}
                        needPay={needPay}
                        visible={controlsVisible}
                    >
                        {isNotDesktop ? (
                            <ClickArea
                                onSingleClick={() => {
                                    if (controlsVisible) {
                                        hideControls();
                                    } else {
                                        showControls();
                                    }
                                }}
                            />
                        ) : null}

                        {isNotDesktop ? (
                            <AnimatePresence>
                                {controlsVisible ? (
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
                            {controlsVisible ? (
                                <motion.div
                                    className={styles.top}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: .3 }}
                                >
                                    <div className={styles.titleBlock}>


                                        <h2 className={styles.titleBlockTitle}>
                                            {title}
                                        </h2>
                                    </div>

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
                                        ) : (
                                            <>
                                                <LevelsSelect
                                                    levels={levelsControls.resolutions}
                                                    activeType={levelsControls.activeOption.type}
                                                    onChange={(value) => {
                                                        levelsControls.setResolutionOption(value);
                                                    }}

                                                />
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                            ) : null}
                        </AnimatePresence>

                        <AnimatePresence>
                            {controlsVisible ? (
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
                                                null
                                            ) : <>
                                                <PlayBtn
                                                    paused={playbackControls.paused}
                                                    onClick={() => {
                                                        playbackControls.togglePlay()
                                                    }}
                                                />

                                                {/* <NextEpisode imdbid={.imdbid} /> */}

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

                                            </>}

                                            <IsLive isLive={liveStreamPlayerControls.isLive} />
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


                                            <ViewMode
                                                isFullscreen={playbackControls.viewMode === 'fullscreen'}
                                                onClick={() => {
                                                    playbackControls.toggleFullscreen();
                                                }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                null
                            )}
                        </AnimatePresence>
                    </Controls>
                </div>
            </div >
        </>
    )
}

export default observer(LiveStreamPlayer)