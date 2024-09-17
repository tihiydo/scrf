'use client'

import classNames from 'classnames';
import styles from './swiper-controls.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MinimalMovie, MinimalMovieOptimize } from '@/entities/movie';
import { MinimalSerial } from '@/entities/serial';
import { Fiction } from '@/entities/fiction';
import { Personality } from '@/entities/pesonality';
import { LiveEvents } from '@/app/[locale]/(public)/sport/entitities';


type Props = {
    disabledPrev?: boolean;
    disabledNext?: boolean;
    onNextSlide: () => void;
    onPrevSlide: () => void;
    fictions: (MinimalMovie | MinimalSerial | Fiction | Personality | LiveEvents | MinimalMovieOptimize)[];
}

const SwiperControls = ({ onNextSlide, onPrevSlide, disabledNext, disabledPrev, fictions }: Props) => {

    // console.log('Prev', disabledNext, 'next', disabledNext)
    console.log(fictions)

    return (
        <div className={styles.controlsContainer}>
            {!disabledPrev == true ? (
                <button
                    className={classNames(styles.arrowButton, styles.arrowButtonLeft)}
                    onClick={onPrevSlide}
                >
                    <ChevronLeft className={styles.arrowButtonIcon} />
                </button>
            ) : <div />}

            {!disabledNext == true && fictions.length > 5 ? (
                <button
                    className={classNames(styles.arrowButton, styles.arrowButtonRight)}
                    onClick={onNextSlide}
                >
                    <ChevronRight className={styles.arrowButtonIcon} />
                </button>
            ) : <div></div>}
        </div>
    )
}

export default SwiperControls