"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import styles from "./fiction-swiper.module.scss";
import "swiper/css";
import { SwiperControls } from "@/components/ui/swiper-controls";
import { FictionCard } from "@/components/swiper-cards/fiction-card";
import { Fiction } from "@/entities/fiction";
import { MinimalSerial, Serial } from "@/entities/serial";
import { MinimalMovie, MinimalMovieOptimize, Movie } from "@/entities/movie";
import { isFiction, isMovie, isSerial } from "@/utils/fiction";



type Props = {
  fictions: (MinimalMovie | MinimalSerial | Fiction | MinimalMovieOptimize)[];
};

export const FictionSwiper = ({ fictions }: Props) => {
  // console.log('swip fic', fictions)

  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<SwiperType>();
  const showNav = !(isEnd && isBeginning);

  return (
    <div className={styles.container}>
      <Swiper
        navigation={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // setIsBeginning(swiper.isBeginning);
          // setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          0: {
            spaceBetween: 10,
            slidesPerView: 2.3,
          },
          768: {
            spaceBetween: 10,
            slidesPerView: 3.3,
          },
          1024: {
            spaceBetween: 20,
            slidesPerView: 4.3,
          },
          1450: {
            spaceBetween: 20,
            slidesPerView: 5.3,
          },
          1600: {
            spaceBetween: 20,
            slidesPerView: 5.3,
          },
        }}
      >
        {fictions?.map((fiction) => (
          isSerial(fiction) ? (
            <SwiperSlide key={fiction.imdbid} >
              <FictionCard type="serial" fiction={fiction} />
            </SwiperSlide>
          ) : (
            isMovie(fiction) ? (
              <SwiperSlide key={fiction.imdbid}>
                <FictionCard type="movie" fiction={fiction} />
              </SwiperSlide>
            ) : (
              isFiction(fiction) ? (
                <SwiperSlide key={fiction.id}>
                  <FictionCard type="fiction" fiction={fiction} />
                </SwiperSlide>
              ) : null

            )
          )
        ))}
      </Swiper>

      {showNav && (
        <SwiperControls
          disabledPrev={isBeginning}
          disabledNext={isEnd}
          fictions={fictions}
          onNextSlide={() => {
            swiperRef.current?.slideNext();
          }}
          onPrevSlide={() => {
            swiperRef.current?.slidePrev();
          }} />
      )}
    </div>
  );
};
