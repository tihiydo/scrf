import styles from './styles.module.scss'
import { useMediaQuery } from '@uidotdev/usehooks';
import { observer } from 'mobx-react-lite';
import { useMoviePlayer } from '../../context';
import { useSpecialKeysHandler } from '@/modules/video-player/shared/hooks/use-special-keys-handler';

type Props = {
    containerRef: TODO;
    children: React.ReactNode;
    visible: boolean;
    needPay: boolean;
    showControls: () => void;
    hideControls: () => void;
}

const Controls = ({ containerRef, needPay, showControls, visible, children, hideControls }: Props) => {
    const { playbackControls, volumeControls, timelineControls } = useMoviePlayer()
    const handleSpecialKeysDown = useSpecialKeysHandler({
        volume: volumeControls,
        timeline: timelineControls,
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
}

export default observer(Controls)