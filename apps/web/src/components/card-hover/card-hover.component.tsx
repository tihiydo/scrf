import { MinimalMovie, MinimalMovieOptimize, Movie } from '@/entities/movie';
import classNames from 'classnames';
import styles from './card-hover.module.scss'
import { LikeIcon, PlusIcon, ShareIcon } from '../icons';
import { Clock9, PlayIcon, Plus, StarIcon, ThumbsUpIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { MinimalSerial, Serial } from '@/entities/serial';
import { Fiction } from '@/entities/fiction';
import { fictionGetter } from '@/utils/fiction';
import { secondsToFormattedString } from '@/utils/time';
import { env } from '@/env';
import { message } from 'antd';
import { AddButton } from '../add-button';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { WatchBtn } from '@/app/[locale]/(public)/(fiction)/_components/watch-btn';
import Link from 'next/link';
import { AddButtonCard } from './_components/add-button-card.component';
import { useSession } from '@/session/hooks/use-session';


type BaseProps = {
    className?: string;
}
type Props = (

    {
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





const HoverCard = ({ type, fiction }: Props) => {

    const [_, copyToClipboard] = useCopyToClipboard();
    const sessionStore = useSession();


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

    {
        type === 'serial' || type === 'movie' ? (
            fiction.rating
        ) : type === 'fiction' ? (
            fictionGetter(fiction, {
                serial({ serial }) {
                    return serial.rating
                },
                movie({ movie }) {
                    return movie.rating
                },
            })
        ) : "Not Found"
    }

    const watchLink = type === 'serial'
        ? `/serial/${fiction.imdbid}/1/1/watch`
        : type === 'movie'
            ? `/movie/${fiction.imdbid}/watch`
            : type === 'fiction'
                ? fiction.kind === 'movie' && fiction.movie
                    ? `/movie/${fiction.movie.imdbid}/watch`
                    : fiction.kind === 'serial' && fiction.serial
                        ? `/serial/${fiction.serial.imdbid}/1/1/watch`
                        : '/'
                : '/'

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.block}>
                    <Button
                        variant="pimary"
                        className={styles.buton}
                    >
                        <Link href={watchLink} className={styles.buton}>
                            <div className={styles.buttonText}>Watch</div>
                            <PlayIcon absoluteStrokeWidth={true} className={styles.icon} width='16' />
                        </Link>
                    </Button >

                    <div className={styles.blockIcons}>
                        {
                            sessionStore.status === 'authentificated'
                                ? <AddButtonCard
                                    fiction={fiction as Movie | Serial}
                                    onClick={(e) => {
                                        e.preventDefault()
                                    }}
                                />
                                : null
                        }

                        <div
                            className={styles.actionsItem}
                            onClick={async (e) => {
                                e.preventDefault()
                                try {
                                    await copyToClipboard(env.NEXT_PUBLIC_SITE_URL + link)
                                    message.success('Link copied')
                                } catch (error) {
                                    message.error('Unable to copy the link')
                                }
                            }}
                        >
                            <ShareIcon className={styles.shareIcon} />
                        </div>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.infoTitle}>
                        {type === 'serial' || type === 'movie' ? (
                            fiction.title
                        ) : type === 'fiction' ? (
                            fictionGetter(fiction, {
                                serial({ serial }) {
                                    return serial.title
                                },
                                movie({ movie }) {
                                    return movie.title
                                },
                            })
                        ) : "Not Found"}
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoStar}>
                            <StarIcon
                                className={classNames(styles.infoItemIcon, styles.infoItemColor,)}
                            />
                            {type === 'serial' || type === 'movie' ? (
                                fiction.rating
                            ) : type === 'fiction' ? (
                                fictionGetter(fiction, {
                                    serial({ serial }) {
                                        return serial.rating
                                    },
                                    movie({ movie }) {
                                        return movie.rating
                                    },
                                })
                            ) : "Not Found"}
                        </div>
                        <div className={styles.infoTime}>
                            <Clock9
                                className={classNames(styles.infoItemIcon)}
                            />

                            {type === 'movie' ? (
                                secondsToFormattedString(fiction.runtime)
                            ) : type === 'fiction' ? (
                                fictionGetter(fiction, {
                                    serial({ serial }) {
                                        console.log(serial.episodesCount.toString())
                                        return serial.episodesCount.toString()
                                    },
                                    movie({ movie }) {
                                        return secondsToFormattedString(movie.runtime)
                                    },
                                })
                            ) : "Not Found"}
                        </div>
                    </div>
                    <div className={styles.infoGenres}>
                        {type === 'serial' || type === 'movie' ? (
                            fiction.fiction?.genres?.map(({ genreName }) => genreName).splice(0, 1).join(', ')
                        ) : type === 'fiction' ? (
                            fictionGetter(fiction, {
                                serial() {
                                    return fiction.genres?.map(({ genreName }) => genreName).splice(0, 1).join(', ')
                                },
                                movie() {
                                    return fiction.genres?.map(({ genreName }) => genreName).splice(0, 1).join(', ')
                                },
                            })
                        ) : "Not Found"}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default HoverCard;