'use client'

import classNames from 'classnames';
import styles from './hero-swiper-controls.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwiper } from 'swiper/react';

type Props = {
    isEnd: boolean;
    isStatrt: boolean;
    onNextSlide: () => void;
    onPrevSlide: () => void;
}

const HeroSwiperControls = ({ isEnd, isStatrt, onNextSlide, onPrevSlide }: Props) => {
    return (
        <div className={styles.container}>
            <button
                className={classNames(styles.arrowButton, styles.arrowButtonLeft)}
                disabled={isStatrt}
                onClick={() => {
                    onPrevSlide()
                }}
            >
                <ChevronLeft className={styles.arrowButtonIcon} />
            </button>

            <button
                className={classNames(styles.arrowButton, styles.arrowButtonRight)}
                disabled={isEnd}
                onClick={() => {
                    onNextSlide()
                }}
            >
                <ChevronRight className={styles.arrowButtonIcon} />
            </button>
        </div>
    )
}

export default HeroSwiperControls