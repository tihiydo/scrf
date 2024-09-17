import { Movie } from '@/entities/movie';
import classNames from 'classnames';
import styles from './film-item.module.scss'
import Image from 'next/image';
import { CheckIcon, FileWarning } from 'lucide-react';

type Props = {
    onClick?: () => void;
    isActive: boolean;
    movie: Movie;
    showError?: boolean;
}

const FilmItem = ({ isActive, movie, onClick, showError }: Props) => {
    const isError = showError ? !movie.previewVideoUrl : false;
    return (
        <div
            className={classNames(styles.item, (isActive && !isError) && styles.itemActive, isError && styles.itemError)}
            onClick={() => {
                onClick?.();
            }}
        >

            <div className={styles.itemContent}>
                <div className={styles.itemImageContainer}>
                    <Image className={styles.itemImage} unoptimized alt={movie.title ?? ''} fill src={movie.portraitImage ?? ''} />
                </div>
                <div>
                    <h5 className={styles.itemTitle}>
                        {movie.title} ({movie.releaseYear})
                    </h5>
                    {movie.previewVideoUrl ? (
                        <a href={movie.previewVideoUrl} target='_blank' className={styles.itemLink} onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            Watch perview
                        </a>
                    ) : (
                        <p>{'No preview video'}</p>
                    )}
                </div>
            </div>

            {isActive && !isError ? (
                <CheckIcon className={styles.itemCheck} />
            ) : null}

            {isError ? (
                <FileWarning className={styles.itemErrorIcon} />
            ) : null}


        </div>
    )
}

export default FilmItem