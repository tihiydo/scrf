"use client"

import { VideoSwiper } from '@/modules/video-swiper'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from "./broadcasts.module.scss"
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Component, Dices, List, PlayIcon } from 'lucide-react'
import "swiper/css";
import classNames from 'classnames';
import { SwiperControls } from '@/components/ui/swiper-controls';
import { Button } from '@/components/ui/button';
import { WatchBtn } from '../../../(fiction)/_components/watch-btn';
import Image from 'next/image';
import { apiClient } from '@/app/api/client';
import { Broadcast, LiveEvents, Url } from '../../entitities';
import { PageTitle } from '@/components/page-title';
import { tr } from 'date-fns/locale';

type Props = {
    sports: { liveSports: { icon: string, id: number, name: string }[], sports: { icon: string, id: number, name: string }[] }
    matches: LiveEvents[]
    setLiveChannel: Dispatch<SetStateAction<Omit<Broadcast, "id">>>
    myDivRef: React.MutableRefObject<null | HTMLElement>
}

const Broadcasts = ({ matches, setLiveChannel, sports, myDivRef }: Props) => {
    const swiperRef = useRef<SwiperType>();
    const [category, setCategory] = useState<string | "all">("all")
    const sportId = sports.liveSports.find((el) => el.name == category)
    const [isBeginning, setIsBeginning] = useState(true)
    const [isEnd, setIsEnd] = useState(false)

    const currentMatches = sportId !== undefined ? matches.filter((el) => el.sportId == sportId.id) : matches


    return (
        <div>
            <PageTitle bottomSpacing>BROADCASTS</PageTitle>
            <div className={styles.buttonsSlider}>
                <Swiper
                    onSwiper={(swiper) => {
                        console.log(swiper)
                        swiperRef.current = swiper;
                        // setIsBeginning(swiper.isBeginning);
                        // setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={(swiper) => {
                        // setIsBeginning(swiper.isBeginning);
                        // setIsEnd(swiper.isEnd);
                    }}
                    spaceBetween={20}
                    breakpoints={{
                        0: {
                            slidesPerView: 2.3,
                        },
                        337: {
                            slidesPerView: 2.3,
                        },
                        500: {
                            slidesPerView: 2.3,
                        },
                        768: {
                            slidesPerView: 3.3,
                        },
                        1024: {
                            slidesPerView: 3.3,
                        },
                    }}
                >
                    <SwiperSlide>
                        <div className={classNames(styles.sliderButton, category == "all" ? styles.sliderButtonActive : {})} onClick={() => { setCategory("all") }}>
                            <List className={styles.swiperButtonIcon} size={15} />
                            <div className={styles.sliderButtonText}>ALL EVENTS</div>
                        </div>
                    </SwiperSlide>

                    {
                        sports.liveSports?.map((el) => {
                            return (
                                <SwiperSlide key={el.id}>
                                    <div className={classNames(styles.sliderButton, category == el.name ? styles.sliderButtonActive : {})} onClick={() => { setCategory(el.name) }}>
                                        <div className={styles.sliderButtonCard}>
                                            <div>
                                                <Image width={24} height={24} src={el.icon} alt={`${el.name} icon`} />
                                            </div>
                                            <div className={styles.sliderButtonText}>{el.name.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>
                <SwiperControls
                    fictions={matches}
                    disabledNext={false}
                    disabledPrev={false}
                    onNextSlide={() => {
                        swiperRef.current?.slideNext();
                    }}
                    onPrevSlide={() => {
                        swiperRef.current?.slidePrev();
                    }}
                /> 
            </div>
            <div className={styles.buttons}>
                <div className={styles.sliderButtons}>
                    <div className={classNames(styles.sliderButton, category == "all" ? styles.sliderButtonActive : {})} onClick={() => { setCategory("all") }}>
                        <List className={styles.swiperButtonIcon} />
                        <div className={styles.sliderButtonText}>ALL EVENTS</div>
                    </div>
                    {
                        sports.liveSports?.map((el) => {
                            return (
                                <div className={classNames(styles.sliderButton, category == el.name ? styles.sliderButtonActive : {})} onClick={() => { setCategory(el.name) }}>
                                    <div className={styles.sliderButtonCard}>
                                        <div>
                                            <Image width={24} height={24} src={el.icon} alt={`${el.name} icon`} />
                                        </div>
                                        <div className={styles.sliderButtonText}>{el.name.toUpperCase()}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div style={{ marginTop: "30px", position: "relative" }}>
                <Swiper
                    navigation={true}
                    onSwiper={(swiper) => {
                        console.log(swiper)
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    spaceBetween={20}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.3,
                        },
                        1023: {
                            slidesPerView: 2.3,
                        },
                        1281: {
                            slidesPerView: 3.3,
                        },
                    }}
                >
                    {
                        currentMatches.length >= 1 ?
                            currentMatches.map((el, i) => {
                                return (<SwiperSlide key={i}>
                                    <div className={styles.card} onClick={async () => {
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
                                    }}>
                                        <div style={{ height: "100%" }}>
                                            <h3>{sports.sports.find((sport) => sport.id == el.sportId)?.name} {el.leagueName ? `(${el.leagueName})` : ""}</h3>
                                            <div className={styles.teamSection}>
                                                {el.firstName &&
                                                    <div className={styles.teams}>
                                                        <div><Image alt="" src={el.firstLogo || ""} width={40} height={40}></Image>{el.firstName}</div>
                                                        <div><Image alt="" src={el.secondLogo || ""} width={40} height={40}></Image>{el.secondName}</div>
                                                    </div>
                                                }
                                                {el.eventName && !(el.firstName) &&
                                                    <div>{el.eventName}</div>
                                                }
                                                <div className={styles.live}><div>●</div><div>LIVE</div></div>
                                            </div>
                                        </div>
                                        <div>
                                            <Button className={styles.buttonWatch} variant={"pimary"}>WATCH <PlayIcon className={styles.buttonWatchSvg} /></Button>
                                        </div>
                                    </div>
                                </SwiperSlide>)
                            }) :
                            <div style={{
                                height: '187px',
                                fontWeight: 'bolder',
                                fontSize: 'larger',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>NO LIVE TO VIEW :(</div>
                    }


                </Swiper>
                <SwiperControls
                    fictions={matches}
                    disabledPrev={isBeginning}
                    disabledNext={isEnd}
                    onNextSlide={() => {
                        swiperRef.current?.slideNext();
                    }}
                    onPrevSlide={() => {
                        swiperRef.current?.slidePrev();
                    }} />
            </div>
        </div>
    )
}

export default Broadcasts