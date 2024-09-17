import styles from '../../components/live-stream-player/styles.module.scss'
import { useMediaQuery } from '@uidotdev/usehooks';
import { observer } from 'mobx-react-lite';
import { useLiveStreamPlayer } from '../../context';
import { useSpecialKeysHandler } from '@/modules/video-player/shared/hooks/use-special-keys-handler';

type Props = {
    containerRef: TODO;
    children: React.ReactNode;
    visible: boolean;
    needPay: boolean;
    showControls: () => void;
}

const Controls = observer(({ containerRef, needPay, showControls, visible, children }: Props) => {
    const { playbackControls, volumeControls, timelineControls } = useLiveStreamPlayer()
    const handleSpecialKeysDown = useSpecialKeysHandler({
        volume: volumeControls,
        playback: playbackControls
    });
    const isMobile = useMediaQuery('screen and (max-width: 1024px');

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={(e) => {
                handleSpecialKeysDown(e);
            }}
            className={styles.container}
        >
            <div
                className={styles.playOverlay}
                onClick={() => {
                    if (!needPay) {
                        if (!isMobile) {
                            playbackControls.togglePlay();
                        }
                    }
                }}
            />
            <div className={styles.controls}>
                {children}
            </div>
        </div>
    )
})

export default Controls