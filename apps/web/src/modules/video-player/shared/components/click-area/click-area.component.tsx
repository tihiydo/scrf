import { useClickStreakHandler } from '@/hooks/use-click-streak-handler';
import { useTrigger } from '@/hooks/use-trigger-state';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import styles from './click-area.module.scss'


type Props = {
    onSingleClick?: () => void;
    onSkip?: () => void;
    onRewind?: () => void;
}

const ClickArea = ({ onSingleClick, onRewind, onSkip }: Props) => {
    const skipAreaRef = useRef<HTMLDivElement>(null);
    const rewindAreaRef = useRef<HTMLDivElement>(null);

    const [triggerSkip, skipVisible] = useTrigger(500);
    const [triggerRewind, rewindVisible] = useTrigger(500);

    const onStreakFinish = useCallback((clicks: number) => {
        if (clicks === 1) {
            onSingleClick?.();
        }
    }, [onSingleClick])

    const handleClickAreaClick = useClickStreakHandler<React.MouseEvent<HTMLDivElement, MouseEvent>>(
        (clicks, e) => {
            const skipArea = skipAreaRef.current;
            const rewindArea = rewindAreaRef.current;

            if (skipArea && skipArea.contains(e.target as any) && clicks > 1) {
                onSkip?.();
                triggerSkip();
                return
            }

            if (rewindArea && rewindArea.contains(e.target as any) && clicks > 1) {
                onRewind?.();
                triggerRewind();
                return;
            }


        },
        {
            onStreakFinish,
            delay: 300
        }
    );


    return (
        <div
            onClick={handleClickAreaClick}
            style={{
                zIndex: 10,
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
            }}
        >
            {onRewind ? (
                <div
                    ref={rewindAreaRef}
                    style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: '0px',
                        top: '0px',
                        width: '35%',
                        height: '100%',
                    }}
                >
                    <AnimatePresence>
                        {rewindVisible ? (
                            <motion.div
                                animate={{
                                    x: '-50%',
                                    y: '-50%',
                                    opacity: 1
                                }}
                                initial={{
                                    x: '100%',
                                    y: '-50%',
                                    opacity: 0
                                }}
                                exit={{
                                    x: '-200%',
                                    y: '-50%',
                                    opacity: 0
                                }}
                                className={styles.motion}
                            >
                                <ChevronsLeftIcon
                                    className={styles.motionIcon}
                                />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            ) : null}

            {onSkip ? (
                <div
                    ref={skipAreaRef}
                    style={{
                        zIndex: 10,
                        position: 'absolute',
                        right: '0px',
                        top: '0px',
                        width: '35%',
                        height: '100%',
                    }}
                >
                    <AnimatePresence>
                        {skipVisible ? (
                            <motion.div
                                animate={{
                                    x: '-50%',
                                    y: '-50%',
                                    opacity: 1
                                }}
                                initial={{
                                    x: '-150%',
                                    y: '-50%',
                                    opacity: 0
                                }}
                                exit={{
                                    x: '100%',
                                    y: '-50%',
                                    opacity: 0
                                }}
                                className={styles.motion}
                            >
                                <ChevronsRightIcon
                                    className={styles.motionIcon}
                                />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            ) : null}
        </div>
    )
}

export default ClickArea