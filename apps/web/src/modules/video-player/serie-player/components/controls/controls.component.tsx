import { useMediaQuery } from '@uidotdev/usehooks';
import { observer } from 'mobx-react-lite';
import { useSpecialKeysHandler } from '@/modules/video-player/shared/hooks/use-special-keys-handler';
import styles from '../serie-player/styles.module.scss'
import { useSerialPlayer } from '../../context';

type Props = {
    containerRef: TODO;
    children: React.ReactNode;
    visible: boolean;
    needPay: boolean;
    showControls: () => void;
}

const Controls = observer(({ containerRef, needPay, children }: Props) => {
    const { playbackControls, volumeControls, timelineControls } = useSerialPlayer()
    const handleSpecialKeysDown = useSpecialKeysHandler({
        volume: volumeControls,
        timeline: timelineControls,
        playback: playbackControls
    });
    const isMobile = useMediaQuery('screen and (max-width: 768px');

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