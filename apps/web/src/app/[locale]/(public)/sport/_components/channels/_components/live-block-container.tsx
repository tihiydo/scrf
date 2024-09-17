"use client"

import styles from "../channels.module.scss"
import { CalendarClock, CalendarRange, Flame, PlayIcon } from 'lucide-react'
import { WatchBtn } from '@/app/[locale]/(public)/(fiction)/_components/watch-btn'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { apiClient } from "@/app/api/client"
import { Broadcast, LiveEvents, Url } from "../../../entitities"
import { formatUnixTime } from "@/utils/time"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type Props = {
    setLiveChannel: Dispatch<SetStateAction<Omit<Broadcast, "id">>>
    matches: LiveEvents[]
    myDivRef: React.MutableRefObject<null | HTMLElement>
    sports: { icon: string, id: number, name: string }[]
}

const LiveBlockContainer = ({ setLiveChannel, matches, sports, myDivRef }: Props) => {
    const [current, setCurrent] = useState<"today" | "hot">("hot")

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getCurrentDayAndMonth = () => {
        const now = new Date(); // Get the current date

        // Extract the day and month
        const day = now.getDate(); // Day of the month
        const month = now.getMonth() + 1; // Month is zero-based (0 = January, 1 = February, etc.)

        // Format day and month to be two digits
        const formattedDay = day.toString().padStart(2, '0'); // Pads single-digit days with a leading zero
        const formattedMonth = month.toString().padStart(2, '0'); // Pads single-digit months with a leading zero

        return `${formattedDay}.${formattedMonth}`; // Return in the format dd,mm
    };

    const filteredMatch = matches.filter((el) => {
        if (current == "today") {
            if (!isSameDay(new Date(el.startAt * 1000), new Date())) {
                return true
            }
        }
        else if (current == "hot") {
            if (!isSameDay(new Date(el.startAt * 1000), new Date())) {
                return true
            }
        }
        else {
            return true
        }
    }).sort((a, b) => {
        const aHasLive = a.liveStream !== null;
        const bHasLive = b.liveStream !== null;

        if (aHasLive && !bHasLive) return -1; // a с `live` идет перед b без `live`
        if (!aHasLive && bHasLive) return 1; // b с `live` идет перед a без `live`

        // Если оба либо с `live`, либо без `live`, сортируем по времени
        return a.startAt - b.startAt;
    });

    return (
        <div className={styles.liveBlockContainer}>
            <div className={styles.liveBlockContainerButtons}>
                <div onClick={() => setCurrent("today")} className={current == "today" ? styles.active : ''}><CalendarRange /><div>TODAY, {getCurrentDayAndMonth()}</div></div>
                <div onClick={() => setCurrent("hot")} className={current == "hot" ? styles.active : ''}><Flame /><div>HOT MATCHES</div></div>
            </div>
            <div className={styles.liveBlock}>

                {
                    filteredMatch.map((el) => {
                        return (
                            el.liveStream == null ? (
                                <div className={styles.liveCard} key={el.uid}>
                                    <div>
                                        <div>
                                            <div><div className={styles.scheduled}><div>SCHEDULED {formatUnixTime(el.startAt)} ({sports.find((sport) => sport.id == el.sportId)?.name.toUpperCase()})</div><div></div></div></div>
                                            <div>{el.leagueName}</div>

                                        </div>
                                        {el.firstName && el.secondName &&
                                            <div>
                                                <Image src={el.firstLogo || ""} alt="" width={27} height={27}></Image>
                                                {el.firstName.toUpperCase()} - {el.secondName.toUpperCase()}
                                                <Image src={el.secondLogo || ""} alt="" width={27} height={27}></Image>
                                            </div>
                                        }
                                        {el.eventName && !(el.firstName) &&
                                            <div>{el.eventName}</div>
                                        }

                                    </div>
                                </div>)
                                :
                                <div className={styles.liveCard} key={el.uid}>
                                    <div>
                                        <div>
                                            <div><div className={styles.live}><div>●</div><div>LIVE ({sports.find((sport) => sport.id == el.sportId)?.name.toUpperCase()})</div></div></div>
                                            <div>{el.leagueName}</div>
                                        </div>
                                        {el.firstName && el.secondName &&
                                            <div>
                                                <Image src={el.firstLogo || ""} alt="" width={27} height={27}></Image>
                                                {el.firstName.toUpperCase()} - {el.secondName.toUpperCase()}
                                                <Image src={el.secondLogo || ""} alt="" width={27} height={27}></Image>
                                            </div>
                                        }
                                        {el.eventName && !(el.firstName) &&
                                            <div>{el.eventName}</div>
                                        }
                                        <div></div>
                                    </div>
                                    <div><Button variant={"pimary"} onClick={async () => {
                                        const a = el.secondName
                                        const b = el.firstName
                                        const c = el.liveStream
                                        const d = el.eventName

                                        if (c) {
                                            if (a && b) {
                                                const parse = JSON.parse(c) as Url[]
                                                parse.find((url) => {
                                                    if (typeof url.title == "string") {
                                                        myDivRef?.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
                                                        setLiveChannel({ channelName: a.toUpperCase() + " - " + b.toUpperCase(), channelLink: url.url })
                                                    }
                                                })
                                            }
                                            if (!a && d) {
                                                const parse = JSON.parse(c) as Url[]
                                                parse.find((url) => {
                                                    if (typeof url.title == "string") {
                                                        myDivRef?.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
                                                        setLiveChannel({ channelName: d, channelLink: url.url })
                                                    }
                                                })
                                            }
                                        }

                                    }}>WATCH <PlayIcon /></Button>
                                    </div>
                                </div>)
                    }
                    )
                }
            </div>
        </div>
    )
}

export default LiveBlockContainer