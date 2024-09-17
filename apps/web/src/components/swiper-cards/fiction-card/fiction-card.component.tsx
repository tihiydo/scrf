"use client"

import { CalendarIcon, Clock9Icon, StarIcon, TvIcon } from "lucide-react";
import styles from "./fiction-card.module.scss";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { secondsToFormattedString } from "@/utils/time";
import { MinimalMovie, MinimalMovieOptimize } from "@/entities/movie";
import { MinimalSerial } from "@/entities/serial";
import { Fiction } from "@/entities/fiction";
import HoverCard from "@/components/card-hover/card-hover.component";
import { useHover } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";


type BaseProps = {
  className?: string;
}
type Props = (
  | {
    type: 'movie';
    fiction: MinimalMovie | MinimalMovieOptimize;
  }
  | {
    type: 'serial',
    fiction: MinimalSerial,
  }
  | {
    type: 'fiction'
    fiction: Fiction
  }
) & BaseProps;



export const FictionCard = ({ fiction, type, className }: Props) => {
  const [ref, hovering] = useHover()

  const isMobile = useMediaQuery('screen and (max-width: 768px');

  const studios =
    type === 'movie' || type === 'serial'
      ? fiction.fiction?.studios
      : type === 'fiction'
        ? fiction.studios
        : []

  const data =
    type === 'movie' || type === 'serial'
      ? fiction
      : fiction.serial
        ? fiction.serial
        : fiction.movie
          ? fiction.movie
          : null

  const link = type === 'serial'
    ? `/serial/${fiction.imdbid}`
    : type === 'movie'
      ? `/movie/${fiction.imdbid}`
      : type === 'fiction'
        ? fiction.kind === 'movie' && fiction.movie
          ? `/movie/${fiction.movie.imdbid}`
          : fiction.kind === 'serial' && fiction.serial
            ? `/serial/${fiction.serial.imdbid}`
            : '/'
        : '/'


  if (!data) throw new Error('Unable to parse card data');

  return (
    <Link
      href={link}
      className={classNames(styles.container)}
    >
      <div className={classNames(styles.card, styles)} ref={ref}>

        <div className={classNames(styles.background, { [`${styles.backgroundAnimation}`]: hovering })}>
          <Image
            className={styles.backgroundImg}
            fill
            quality={70}
            src={data.portraitImage ?? ''}
            alt={data.title}
          />
          <div className={styles.backgroundGradient}></div>
        </div>

        <AnimatePresence>
          {!hovering ? (
            <motion.div
              key={"content"}
              initial={{ x: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={styles.animationInfo}
            >
              <h6 className={styles.cardTitle}>{data.title}</h6>

              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <StarIcon
                    className={classNames(styles.infoItemIcon, styles.infoItemStar,)}
                  />
                  {data.rating}
                </div>

                <div className={styles.infoItem}>
                  <CalendarIcon className={styles.infoItemIcon} />
                  {data.releaseYear}
                </div>

                {
                  type === 'movie' ? (
                    <div className={classNames(styles.infoItem, styles.infoItemTime)}>
                      <Clock9Icon className={styles.infoItemIcon} />
                      {secondsToFormattedString(fiction?.runtime)}
                    </div>
                  ) : null
                }

                {studios?.[0]?.studioName.length ? (
                  <div className={styles.infoItem}>
                    <TvIcon className={styles.infoItemIcon} />
                    <div className={styles.infoItemText}>
                      {studios[0]?.studioName}
                    </div>
                  </div>


                ) : null}
              </div>
            </motion.div>
          ) :
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ height: "height", x: 0, y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={classNames(styles.animationHover)}
            >
              {!isMobile && (
                type === 'movie' ? (
                  <HoverCard type={type} fiction={fiction} />
                ) : type === 'serial' ? (
                  <HoverCard type={type} fiction={fiction} />
                ) : type === 'fiction' ? (
                  <HoverCard type={type} fiction={fiction} />
                ) : null

              )}
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </Link>
  );
};
