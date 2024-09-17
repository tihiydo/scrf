import { Button } from '@/components/ui/button'
import { MinimalMovie } from '@/entities/movie'
import { MinimalSerial } from '@/entities/serial'
import { isMovie, isSerial } from '@/utils/fiction'
import { CheckIcon, SquareArrowOutUpRightIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import styles from './styles.module.scss'
import Link from 'next/link'
import { secondsToFormattedString } from '@/utils/time'
import { Fiction } from '@/entities/fiction'

type Props = {
    selected: boolean;
    fiction: Fiction;
    onClick?: (fiction: Fiction) => void;
}

const SelectCard = ({ fiction, selected, onClick }: Props) => {


    const fictionData = fiction.kind === 'serial' && isSerial(fiction.serial)
        ? fiction.serial!
        : fiction.kind === 'movie' && isMovie(fiction.movie)
            ? fiction.movie!
            : null;

    const link = isMovie(fictionData)
        ? `/movie/${fictionData.imdbid}`
        : isSerial(fictionData)
            ? `/serial/${fictionData.imdbid}`
            : null;

    if (!fictionData) throw new Error('Could not parse card data')

    return (
        <div
            className={styles.card}
            onClick={() => {
                onClick?.(fiction)
            }}
        >
            <div className={styles.cardSelect}>
                {selected ? (
                    <CheckIcon className={styles.cardSelectIcon} />
                ) : null}
            </div>
            <Image className={styles.cardImg} src={fictionData.portraitImage} width={200} height={400} alt={fictionData.title} />

            <div className={styles.cardContent}>
                <div className={styles.cardContentRaw}>
                    <h4 className={styles.cardTitle}>
                        <p>{fictionData.title} ({isMovie(fictionData)
                            ? fictionData.releaseYear
                            : isSerial(fictionData)
                                ? <>{fictionData.releaseYear} - {fictionData.endYear ?? 'Present'}</>
                                : null})
                        </p>
                    </h4>

                    {fiction?.genres?.length ? (
                        <p className={styles.cardValue}>{fiction?.genres.map(g => g.genreName)?.join(', ')}</p>
                    ) : null}

                    {isMovie(fictionData) ? (
                        <p className={styles.cardValue}>{secondsToFormattedString(fictionData.runtime ?? 0)}</p>
                    ) : null}


                    {isSerial(fictionData) ? (
                        <p className={styles.cardValue}>{fictionData.episodesCount ?? 0} Episodes</p>
                    ) : null}

                    {typeof fictionData.voteCount === 'number' ? (
                        <p className={styles.cardValue}>{fictionData.voteCount ?? 0} IMDb votes</p>
                    ) : null}
                </div>

                {fictionData.rating ? (
                    <div className={styles.cardRating}>
                        <StarIcon className={styles.cardRatingIcon} />
                        <p className={styles.cardRatingText}>{fictionData.rating} / 10</p>
                    </div>
                ) : null}

                {link ? (
                    <Link className={styles.cardLink} href={link} target='_blank'>
                        <Button className={styles.cardLinkBtn} variant={'ghost'} size={'icon'}>
                            <SquareArrowOutUpRightIcon className={styles.cardLinkIcon} />
                        </Button>
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

export default SelectCard