import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { PlayerEvents } from '../types/events';
import { useSerialPlayer } from '../serie-player/context';

type Props = PlayerEvents

const EventCapture = ({
    onPlayChange,
    onTimeChange,
    onViewModeChange
}: Props) => {
    const { timelineControls, playbackControls } = useSerialPlayer();

    useEffect(() => {
        onPlayChange?.(!playbackControls.paused)
    }, [playbackControls.paused])

    useEffect(() => {
        onTimeChange?.(timelineControls.currentTime, {
            bufferedTill: timelineControls.buffered,
            duration: timelineControls.duration
        })
    }, [timelineControls.currentTime])

    useEffect(() => {
        onViewModeChange?.(playbackControls.viewMode)
    }, [onViewModeChange, playbackControls.viewMode])

    return (
        <>
        </>
    )
}

export default observer(EventCapture)