"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import styles from "../top-studios.module.scss";
import "swiper/css";
import { SwiperControls } from "@/components/ui/swiper-controls";
import { FictionCard } from "@/components/swiper-cards/fiction-card";
import { Fiction } from "@/entities/fiction";
import { MinimalSerial, Serial } from "@/entities/serial";
import { MinimalMovie, MinimalMovieOptimize, Movie } from "@/entities/movie";
import { isFiction, isMovie, isSerial } from "@/utils/fiction";
import { Link } from "@/i18n/navigation";
import Image from 'next/image'
import hulu from "../hulu.svg"
import hbo from "../hbo.svg"
import ebene from "../ebene.svg"
import disney from "../disney.svg"
import netflix from "../netflix.svg"





export const StudioSwiper = () => {
  // console.log('swip fic', fictions)

  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(true);
  const swiperRef = useRef<SwiperType>();
  const showNav = !(isEnd && isBeginning);

  return (
    <div className={styles.swiper}>
      <Swiper
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          0: {
            spaceBetween: 10,
            slidesPerView: 3.3,
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
            slidesPerView: 4.3,
          },
          1600: {
            spaceBetween: 20,
            slidesPerView: 4.3,
          },
        }}
      >
        <div className={styles.wrapper}>
          <SwiperSlide >
            <div className={styles.image}>
              <Link href="/categories/films?studio=str-Netflix&page=num-1">
                <Image src={netflix} alt="" width={100} className={styles.imageNetflix} />
              </Link>
            </div>
          </SwiperSlide>
          <SwiperSlide >
            <div className={styles.image}>
              <Link href="/categories/films?studio=str-HBO+Max&page=num-1">
                <Image src={hbo} alt="" width={100} className={styles.imageHbo} />
              </Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.image}>
              <Link href="/categories/films?studio=str-Amazon+Prime+Video&page=num-1">
                <Image src={ebene} alt="" width={100} className={styles.imagePrime} />
              </Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.image}>
              <Link href="/categories/films?studio=str-Walt+Disney+Pictures&page=num-1">
                <Image src={disney} alt="" width={100} className={styles.imageDisnay} />
              </Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.image}>
              <Link href="/categories/films?studio=str-Hulu+Originals&page=num-1">
                <Image src={hulu} alt="" width={100} className={styles.imagePrime} />
              </Link>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>

      {/* {showNav && (
        <SwiperControls
          onNextSlide={() => {
            swiperRef.current?.slideNext();
          }}
          onPrevSlide={() => {
            swiperRef.current?.slidePrev();
          }}
        />
      )} */}
    </div>
  );
};
