'use client'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import styles from '../video-swiper.module.scss'
import VideoSwiperControls from './video-swiper-controls.component';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoBackground } from '@/components/ui/hero-background';
import { Volume2Icon, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import classNames from 'classnames';
import { TopSection, TopSectionPage } from '@/entities/top-section';
import { useQuery } from '@tanstack/react-query';
import { getClientTopSectionKeys } from '@/constants/query-keys';
import { Movie } from '@/entities/movie';
import { HeroCard } from '@/components/hero-card';
import { apiClient } from '@/app/api/client';
import { env } from '@/env';

type Props = {

    page?: TopSectionPage;
    classNames?: Partial<{
        slide: string;
    }>;
}

const VideoSwiper = ({ classNames: componentClassNames, page = 'Home' }: Props) => {
    const swiperRef = useRef<SwiperType>();
    const [activeSlide, setActiveSlide] = useState<Maybe<Movie>>(null);
    const [isSoundOn, setIsSoundOn] = useState(false);
    const topSectionQuery = useQuery({
        queryKey: getClientTopSectionKeys(page),
        queryFn: async () => {
            const response = await apiClient.get<TopSection>(`/top-section/${page}`)

            return response.data;
        }
    })

    console.log(activeSlide?.previewVideoUrl)

    const movies = topSectionQuery.data?.movies ?? [];

    return (
        <>
            <div className={styles.container}>
                <Swiper
                    loop
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setActiveSlide(topSectionQuery.data?.movies[swiper.realIndex])

                    }}
                    onSlideChange={(swiper) => {
                        setActiveSlide(topSectionQuery.data?.movies[swiper.realIndex])
                    }}
                    spaceBetween={20}
                >
                    {
                        movies.map((movie) => (
                            <SwiperSlide className={classNames(styles.slideContainer, componentClassNames?.slide)} key={movie.imdbid}>
                                <div>
                                    <HeroCard movie={movie} />
                                </div>

                                <div className={styles.other}>
                                    <Button onClick={() => setIsSoundOn(!isSoundOn)} variant={'ghost'} size={'icon'} className={styles.volume}>
                                        {isSoundOn
                                            ? <Volume2Icon className={styles.volumeIcon} />
                                            : <VolumeX className={styles.volumeIcon} />}
                                    </Button>
                                    <div className={styles.ageCategory}>
                                        {activeSlide?.ageRestriction ?? 16}+
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>

                {movies.length > 1 ? (
                    <VideoSwiperControls
                        onNextSlide={() => {
                            swiperRef.current?.slideNext()
                        }}
                        onPrevSlide={() => {
                            swiperRef.current?.slidePrev()
                        }}
                    />
                ) : null}
            </div>

            <AnimatePresence
                mode='sync'
            >
                {activeSlide ? (
                    <motion.div
                        className={styles.bgContainer}
                        key={activeSlide.imdbid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0 }}
                    >
                        <VideoBackground muted={!isSoundOn} src={activeSlide.previewVideoUrl ? (env.NEXT_PUBLIC_API_URL + activeSlide.previewVideoUrl) : ''} />
                    </motion.div>
                ) : null}

            </AnimatePresence>
        </>
    )
}

export default VideoSwiper