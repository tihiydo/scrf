"use client"

import { VideoSwiper } from '@/modules/video-swiper'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from "./channels.module.scss"
import { ConfigProvider, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { CalendarClock, CalendarRange, Flame, Search, SearchX, SearchXIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { WatchBtn } from '../../../(fiction)/_components/watch-btn'
import LiveBlockContainer from './_components/live-block-container'
import { apiClient } from '@/app/api/client'
import { Broadcast, LiveEvents } from '../../entitities'
import { encryptLiveStreamUrl } from '@/utils'
import SearchComponent from './_components/search'
import classNames from 'classnames'

type Props = {
    sports: { liveSports: { icon: string, id: number, name: string }[], sports: { icon: string, id: number, name: string }[] }
    liveChannel: Omit<Broadcast, "id">,
    setLiveChannel: Dispatch<SetStateAction<Omit<Broadcast, "id">>>
    matches: LiveEvents[]
    myDivRef: React.MutableRefObject<null | HTMLElement>
}

const Broadcasts = ({ liveChannel, setLiveChannel, matches, sports, myDivRef }: Props) => {
    const [channels, setChannels] = useState<Broadcast[]>([])
    const [filteredChannels, setFilteredChannels] = useState<Broadcast[]>([])

    const getChannels = async () => {
        const request = await apiClient.get<Broadcast[]>("broadcasts")
        const response = request.data.sort((a, b) => {
            return a.channelName.localeCompare(b.channelName)
        })

        setChannels(response)
        setFilteredChannels(filteredChannels)
    }

    useEffect(() => {
        getChannels()
    }, [])

    return (
        <div style={{ margin: "60px 0" }}>
            <h2 className={styles.title}>CHANNELS</h2>
            <div className={styles.blocks}>
                <div className={styles.channelSearch}>
                    <SearchComponent data={channels} setData={setFilteredChannels} />
                    {
                        filteredChannels.length !== 0 ? (
                            <div className={styles.channelCards}>
                                {filteredChannels.map((el) => {
                                    return <div className={classNames(styles.channelCardInSearch, liveChannel.channelName == el.channelName ? styles.channelCardInSearchActive : "")} key={el.id}
                                        onClick={async () => {
                                            myDivRef?.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
                                            setLiveChannel({ channelName: el.channelName, channelLink: el.channelLink })
                                        }}>{el.channelName}</div>
                                })}
                            </div>
                        ) : (
                            <div className={styles.noData}>
                                <SearchXIcon className={styles.noDataIcon} />

                                <p className={styles.noDataText}>No Channels Found</p>
                            </div>
                        )
                    }
                </div>
                <LiveBlockContainer setLiveChannel={setLiveChannel} matches={matches} sports={sports.sports} myDivRef={myDivRef} />
            </div>
        </div >
    )
}

export default Broadcasts