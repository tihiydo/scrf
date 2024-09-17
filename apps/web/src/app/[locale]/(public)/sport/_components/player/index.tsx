'use client';

import { LiveStreamPlayer } from '@/modules/video-player'
import { encryptLiveStreamUrl } from '@/utils'
import classNames from 'classnames';
import { HlsConfig } from 'hls.js'
import styles from './styles.module.scss'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { apiClient } from '@/app/api/client';
import { Broadcast } from '../../entitities';

type Props = {
    liveChannel: Omit<Broadcast, "id">,
    setLiveChannel: Dispatch<SetStateAction<Omit<Broadcast, "id">>>
    myDivRef: React.MutableRefObject<null>
}

const index = ({ liveChannel, setLiveChannel, myDivRef }: Props) => {
    const config = useRef({
        backBufferLength: 90,
        enableWorker: false,
    } satisfies Partial<HlsConfig>)

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [encryptedLink, setEncryptedLink] = useState<string>(liveChannel.channelLink || "");

    const getStreamUrl = async () => {
        const encryptLink = await encryptLiveStreamUrl(liveChannel.channelLink)
        setEncryptedLink(encryptLink)

    }

    useEffect(() => {
        getStreamUrl()
        const intervalId = setInterval(getStreamUrl, 3600 * 6); // Интервал в 1 секунду
        return () => clearInterval(intervalId);
    }, [liveChannel.channelLink]);

    return (
        <div ref={myDivRef} className={classNames(styles.player, isFullscreen ? styles.playerFullscreen : '')}>
            <LiveStreamPlayer
                title={liveChannel.channelName}
                src={encryptedLink}
                coverImg=''
                hlsConfig={config.current}
                onViewModeChange={(viewMode) => {
                    const isFullscreen = viewMode === 'fullscreen'

                    if (isFullscreen) {
                        document.body.style.overflow = 'hidden'
                    } else {
                        document.body.style.overflow = 'visible'
                    }
                    setIsFullscreen(isFullscreen);
                }}
            />
        </div>
    )
}

export default index