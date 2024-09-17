'use client'

import { useHover, useMediaQuery, usePrevious } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume1Icon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import styles from './volume.module.scss'
import { useEffect, useState } from 'react'
import { Slider } from 'antd'
import { observer } from 'mobx-react-lite'
import useTimeout from '@/hooks/use-timeout'
import { ControlsButton } from '../ui/controls-button'


type Props = {
    isMuted: boolean;
    volume: number;
    onClick?: () => void;
    onChange?: (volume: number) => void;
}

const Volume = ({ isMuted, volume, onClick, onChange }: Props) => {
    const [open, setOpen] = useState(false)
    const [ref, isHovering] = useHover()
    const prevVol = usePrevious(volume)
    const isMobile = useMediaQuery("only screen and (max-width : 767px)");

    const { reset } = useTimeout(() => {
        if (isHovering) return;
        setOpen(false)
    }, 2000)

    useEffect(() => {
        if (!isHovering) return;
        setOpen(true)
        reset()
    }, [isHovering])

    useEffect(() => {
        if (prevVol === null) return;
        setOpen(true)
        reset()
    }, [volume, isMuted])


    return (
        <div className={styles.volume} ref={ref}>
            <ControlsButton
                className={styles.btn}
                onClick={() => {
                    onClick?.()
                }}
            >
                {isMuted ? (
                    <VolumeXIcon className={styles.icon} />
                ) : volume > 60 ? (
                    <Volume2Icon className={styles.icon} />
                ) : <Volume1Icon className={styles.icon} />}
            </ControlsButton>

            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ width: isMobile ? 'auto' : 0, height: isMobile ? 0 : 'auto', opacity: 0 }}
                        exit={{ width: isMobile ? 'auto' : 0, height: isMobile ? 0 : 'auto', opacity: 0 }}
                        animate={{ width: 'auto', height: 'auto', opacity: 1 }}
                        transition={{ duration: .2 }}
                        className={styles.volumeSlider}
                    >
                        <div
                            className={styles.volumeSliderSlider}
                        >
                            <Slider
                                vertical={isMobile}
                                max={100}
                                min={0}
                                value={volume}
                                onChange={(newVolume) => {
                                    onChange?.(newVolume)
                                }}
                            />
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

export default observer(Volume)