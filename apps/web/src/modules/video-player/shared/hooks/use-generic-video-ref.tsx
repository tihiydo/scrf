import { useEffect, useRef, useState } from "react"
import { TimelineControlsStore } from "../stores/timeline-store"
import { PlaybackControlStore } from "../stores/playback-store";
import { VolumeControlStore } from "../stores/volume-store";
import { useVolumeControls } from "./internal/_use-volume-controls";
import { usePlaybackControls } from "./internal/_use-playback-controls";
import { sessionStore } from "@/session/session.store";
import { decryptAes, encryptAes } from "@/utils";
import { useTimelineControls } from "./internal/_use-timeline-controls";
import { MediaInfoStore } from "../stores/media-info-store";
import { getWindow } from "@/utils/client";
import screenfull from "screenfull";
import { useMediaQuery } from "@uidotdev/usehooks";
import { isNativeMobileAppUser } from "../utils";
import { UNAUTHORIZED_WATCH_ACCESS_TIMEOUT } from "@/session/constants";


type Controls = Partial<{
    timeline: TimelineControlsStore;
    playback: PlaybackControlStore;
    volume: VolumeControlStore;
    mediaInfo: MediaInfoStore;
}>


// This hook uses MobX sessionStore so component that uses it should be wrapped in observable HOC
export function useGenericVideoRef(opts: { controls: Controls, setNeedPay: (needPay: boolean) => void, autorotate?: boolean }) {
    const window = getWindow();
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [currentTimeState, setCurrentTimeState] = useState<number>(0)
    const isTabletOrMobile = useMediaQuery('screen and (max-width: 1024px');


    useVolumeControls(videoRef, opts.controls.volume)
    usePlaybackControls(videoRef, opts.controls.playback, opts.controls.mediaInfo)
    useTimelineControls(videoRef, opts.controls.timeline);

    useEffect(() => {
        return () => {
            try {
                screenfull.exit()
            } catch (error) {
                console.log(error)
            }
        }
    }, [])


    useEffect(() => {
        if (!opts.autorotate) return;

        const lockOrientation = async () => {
            try {
                // Attempt to lock the screen orientation to landscape
                await screen.orientation.lock('landscape');
            } catch (err: any) {
                // Handle error in case orientation lock fails
                console.error('Failed to lock orientation:', err);
            }
        };

        // Check if the screen orientation API and the lock method exist
        if ('orientation' in screen && typeof screen.orientation.lock === 'function' && isTabletOrMobile) {
            // Check if full screen API is supported by the browser
            if (screenfull.isEnabled) {
                screenfull
                    .request()
                    .then(() => {
                        lockOrientation(); // Try locking orientation after entering full screen
                    })
                    .catch((err) => {
                        console.log('Fullscreen erro', err)
                    });
            }
        }

        // Cleanup: Unlock orientation when component unmounts
        return () => {
            if ('orientation' in screen && typeof screen.orientation.unlock === 'function') {
                screen.orientation.unlock();
            }
        };
    }, [isTabletOrMobile, opts.autorotate]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !opts.controls.playback || sessionStore?.user?.currentSubscription) return;
        const currentTime = Math.round(video.currentTime)
        if (currentTimeState !== currentTime) {
            const ttm = Number(decryptAes(localStorage.getItem("ttm") || 0, "ttmkey"))
            if (ttm < UNAUTHORIZED_WATCH_ACCESS_TIMEOUT) {
                localStorage.setItem("ttm", encryptAes(ttm + 1, "ttmkey"))
                setCurrentTimeState(currentTime)
            }
            else {
                opts.setNeedPay(true)
                opts.controls.playback.setPaused(true)
            }
        }

    }, [videoRef.current?.currentTime, sessionStore?.user, window])

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !opts.controls?.playback) return;

        const handleAirPlayAvailability = (event: any) => {
            if (event.availability === 'available') {
                opts.controls.playback?.toggleAirPlayAvailable(true);
            } else {
                opts.controls.playback?.toggleAirPlayAvailable(false);
            }
        };

        const wirelessChanged = () => {
            opts.controls.playback?.toggleAirPlayEnabled(video.webkitCurrentPlaybackTargetIsWireless);
        };

        if (window?.WebKitPlaybackTargetAvailabilityEvent) {
            video.addEventListener('webkitplaybacktargetavailabilitychanged', handleAirPlayAvailability);
            video.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', wirelessChanged);
        }

        return () => {
            video.removeEventListener('webkitplaybacktargetavailabilitychanged', handleAirPlayAvailability);
            video.removeEventListener('webkitcurrentplaybacktargetiswirelesschanged', wirelessChanged);
        };
    }, [])

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !opts.controls?.playback) return;
        if (!opts.controls.playback.airPlayEnabled) return;

        // Start AirPlay
        if (window?.WebKitPlaybackTargetAvailabilityEvent && !video.webkitCurrentPlaybackTargetIsWireless) {
            video.webkitShowPlaybackTargetPicker?.();
        }
    }, [opts.controls.playback?.airPlayEnabled]);

    // useEffect(() => {
    //     if (!window) return;

    //     const handleCastStateChange = () => {
    //         if (!window) return;

    //         const castContext = window?.cast?.framework?.CastContext?.getInstance();
    //         const currentState = castContext?.getCastState();

    //         if (googleCastStore.castState !== currentState) {
    //             googleCastStore.castState = currentState;
    //         }
    //     };

    //     const castContext = window.cast?.framework?.CastContext?.getInstance();
    //     castContext?.addEventListener(
    //         window.cast?.framework?.CastContextEventType?.CAST_STATE_CHANGED,
    //         handleCastStateChange
    //     );

    //     return () => {
    //         castContext?.removeEventListener(
    //             window.cast?.framework?.CastContextEventType?.CAST_STATE_CHANGED,
    //             handleCastStateChange
    //         );
    //     };
    // }, []);

    // // Synchronize changes from MobX store to Cast API
    // useEffect(() => {
    //     if (!googleCastStore.isAvailable) return;

    //     const initializeCastContext = () => {
    //         const castContext = window?.cast?.framework?.CastContext?.getInstance();
    //         if (!castContext) return;

    //         if (googleCastStore.castState === 'CONNECTED') {
    //             // Trigger some action, e.g., start casting if it's not already active
    //             if (!castContext.getCurrentSession()) {
    //                 googleCastStore.startCasting('VIDEO_URL');
    //             }
    //         } else if (googleCastStore.castState !== 'CONNECTED') {
    //             // Stop casting if the state changes
    //             const session = castContext.getCurrentSession();
    //             if (session) {
    //                 session.endSession(true);
    //             }
    //         }
    //     };

    //     initializeCastContext();
    // }, [googleCastStore.castState]);



    return videoRef;
}