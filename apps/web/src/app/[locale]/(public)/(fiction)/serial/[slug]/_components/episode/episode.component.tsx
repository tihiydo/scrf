import { type Episode as EpiosdeType } from "@/entities/serial/episode";
import styles from "./episode.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { Link } from "@/i18n/navigation";
import { Serial } from "@/entities/serial";
import { Season } from "@/entities/serial/season";
import PlayIcon from "@/components/icons/play-icon";
import { AnimatePresence, motion } from "framer-motion";
import { useHover, useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";

type Props = {
  serial: Serial;
  season: Season;
  episode: EpiosdeType
}
export const Episode = ({ episode, season, serial }: Props) => {
  const [ref, hovering] = useHover();
  const isSmallScreen = useMediaQuery('screen and (max-width: 768px)');

  return (
    <div className={classNames(styles.episode, 'container')} ref={ref}>
      <AnimatePresence>
        <Link href={`/serial/${serial.imdbid}/${season.position}/${episode.position}/watch`} className={styles.episode__preview} >
          <div className={styles['episode__preview-overlay']}></div>
          {hovering && !isSmallScreen && (
            <motion.div
              className={styles['episode__preview-button-animation']}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button type='button' variant={"pimary"} className={styles['episode__preview-button']} >
                Watch
                <PlayIcon className={styles['episode__preview-icon']} />
              </Button>
            </motion.div>
          )}
          <Image src={episode.portraitImage} alt={episode.title} fill></Image>
        </Link>
      </AnimatePresence>
      <Link href={`/serial/${serial.imdbid}/${season.position}/${episode.position}/watch`} >
        <div className={styles.episode__info}>
          <div className={styles.episode__topInfo}>
            <h3 className={styles.episode__title}>{episode.position}. {episode.title}</h3>
            {episode.runtime ? (
              <p className={styles.episode__duration}>
                {Math.round(episode.runtime / 60)} minutes
              </p>
            ) : null}
          </div>
          <p className={styles.episode__description}>
            {episode.description}
          </p>
        </div>
      </Link>
    </div>
  );
};
