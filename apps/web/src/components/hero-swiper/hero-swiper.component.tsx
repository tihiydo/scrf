'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useRef, useState } from 'react';
import HeroSwiperControls from './hero-swiper-controls.component';
import { StaticImageData } from 'next/image';
import { HeroBackground, ImageBackground, VideoBackground } from '../ui/hero-background';
import { Swiper as SwiperType } from 'swiper/types';
import styles from './hero-swiper.module.scss'
import { AnimatePresence, motion } from 'framer-motion'

type SlideItem = {
  id: string | number;
  slide: React.ReactNode;
  type: 'image'
  image: string | StaticImageData;
} | {
  id: string | number;
  slide: React.ReactNode;
  type: 'video'
  video: string;
  muted: boolean;
}

type Props = {
  className?: string;
  slides: Array<SlideItem>
}

const HeroSwiper = ({ className, slides }: Props) => {
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(true)
  const swiperRef = useRef<SwiperType>();
  const [activeSlide, setActiveSlide] = useState<Maybe<SlideItem>>(null);
  const showNav = !(isEnd && isBeginning)


  return (
    <>
      <div className={styles.container}>
        <Swiper
          className={className}
          loop
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveSlide(slides[swiper.realIndex])
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd)
          }}
          onSlideChange={(swiper) => {
            setActiveSlide(slides[swiper.realIndex])
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
          }}
          spaceBetween={20}
        >
          {
            slides.map(({ slide, id }) => (
              <SwiperSlide key={id}>
                {slide}
              </SwiperSlide>
            ))
          }
        </Swiper>

        {showNav && (
          <HeroSwiperControls
            onNextSlide={() => {
              swiperRef.current?.slideNext()
            }}
            onPrevSlide={() => {
              swiperRef.current?.slidePrev()
            }}
            isEnd={false}
            isStatrt={false}
          />
        )}
      </div>

      <AnimatePresence
        mode='popLayout'
      >
        {activeSlide ? (
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, }}
            exit={{ opacity: 0 }}
          >
            <HeroBackground>

              {activeSlide?.type === 'image' ? (
                <ImageBackground src={activeSlide.image} alt='Background' fill />

              ) : null}

              {activeSlide?.type === 'video' ? (
                <VideoBackground src={activeSlide.video} muted={activeSlide.muted} />
              ) : null}
            </HeroBackground>
          </motion.div>
        ) : null}

      </AnimatePresence>
    </>
  )
}

export default HeroSwiper