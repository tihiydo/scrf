"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { Personality } from "@/entities/pesonality";

import { ActorCard } from "@/components/swiper-cards/actor-card";
import { SwiperControls } from "@/components/ui/swiper-controls";
import styles from './actors-swiper.module.scss';

type Props = {
  actors: Personality[];
};

const ActorsSwiper = ({ actors }: Props) => {
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
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2.3,
          },
          768: {
            slidesPerView: 3.3,
          },
          1024: {
            slidesPerView: 4.3,
          },
          1600: {
            slidesPerView: 5.3,
          },
        }}
      >
        {actors?.map((actor) => (
          <SwiperSlide key={actor.imdbid}>
            <ActorCard actor={actor} />
          </SwiperSlide>
        ))}
      </Swiper>

      {showNav && (
        <SwiperControls
          fictions={actors}
          disabledPrev={isBeginning}
          disabledNext={isEnd}
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


export default ActorsSwiper;