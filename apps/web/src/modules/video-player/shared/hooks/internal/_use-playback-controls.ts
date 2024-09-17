

import { MutableRefObject, useEffect } from "react";
import { PlaybackControlStore } from "../../stores/playback-store";
import { MediaInfoStore } from "../../stores/media-info-store";
import screenfull from 'screenfull'


export function usePlaybackControls(
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    controls?: PlaybackControlStore,
    mediaInfoControls?: MediaInfoStore
) {

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !controls || (mediaInfoControls?.manifestState !== 'loaded' && mediaInfoControls?.manifestState !== 'parsed')) return;

        if (controls.paused) {
            video.pause()
        } else {
            video.play()
        };
    }, [controls?.paused, mediaInfoControls?.manifestState])

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !controls) return;

        video.playbackRate = controls.playbackRate
    }, [controls?.playbackRate])

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!controls) return;

            const isFullscreen = screenfull.isFullscreen;
            const isStateFullscreen = controls.viewMode === 'fullscreen';

            if (isFullscreen !== isStateFullscreen) {
                controls.toggleFullscreen();
            }
        };

        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
        }

        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, []);

    useEffect(() => {
        if (!controls || !screenfull.isEnabled) return;

        if (controls.viewMode === 'fullscreen') {
            if (!screenfull.isFullscreen) {
                screenfull.request().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            }
        } else {
            if (screenfull.isFullscreen) {
                screenfull.exit().catch(err => {
                    console.error(`Error attempting to exit full-screen mode: ${err.message}`);
                });
            }
        }
    }, [controls?.viewMode === 'fullscreen']);


    // Picture in picture 
    useEffect(() => {
        const handlePiPChange = () => {
            if (!controls) return;

            const isInPiP = !!document.pictureInPictureElement;
            const isStatePiP = controls.viewMode === 'PiP';

            if (isInPiP !== isStatePiP) {
                controls.togglePIP();
            }
        };

        document.addEventListener('enterpictureinpicture', handlePiPChange);
        document.addEventListener('leavepictureinpicture', handlePiPChange);

        return () => {
            document.removeEventListener('enterpictureinpicture', handlePiPChange);
            document.removeEventListener('leavepictureinpicture', handlePiPChange);
        };
    }, []);

    useEffect(() => {
        if (!controls) return;

        if (controls.viewMode === 'PiP') {
            const videoElement = videoRef.current;
            if (videoElement && !document.pictureInPictureElement && videoElement.requestPictureInPicture) {
                videoElement.requestPictureInPicture?.().catch(error => {
                    console.error('Error entering Picture-in-Picture mode:', error);
                });
            }
        } else {
            const videoElement = videoRef.current;
            if (videoElement && document.pictureInPictureElement && document.exitPictureInPicture) {
                document.exitPictureInPicture?.().catch(error => {
                    console.error('Error exiting Picture-in-Picture mode:', error);
                });
            }
        }
    }, [controls?.viewMode === 'PiP']);
}