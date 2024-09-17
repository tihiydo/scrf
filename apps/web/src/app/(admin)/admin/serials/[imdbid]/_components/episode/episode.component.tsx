import { type Episode as EpiosdeType } from "@/entities/serial/episode";
import styles from "./episode.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { Serial } from "@/entities/serial";
import { Season } from "@/entities/serial/season";
import PlayIcon from "@/components/icons/play-icon";
import Link from "next/link";


type Props = {
  serial: Serial;
  season: Season;
  episode: EpiosdeType
}
export const Episode = ({ episode, season, serial }: Props) => {
  return (
    <div className={classNames(styles.episode, 'container')}>
      <Link href={`/admin/serials/${serial.imdbid}/${episode.imdbid}/`} className={styles.episode__preview}>
        <div className={styles['episode__preview-overlay']}></div>
        <PlayIcon className={styles['episode__preview-icon']} />
        <Image src={episode.portraitImage} alt={episode.title} fill></Image>
      </Link>
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
    </div>
  );
};
