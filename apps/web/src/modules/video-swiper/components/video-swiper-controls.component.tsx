'use client'

import classNames from 'classnames';
import styles from '../video-swiper.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    onNextSlide: () => void;
    onPrevSlide: () => void;
}

const VideoSwiperControls = ({  onNextSlide, onPrevSlide }: Props) => {
    return (
        <div className={styles.controlsContainer}>
            <button
                className={classNames(styles.arrowButton, styles.arrowButtonLeft)}
                onClick={() => {
                    onPrevSlide()
                }}
            >
                <ChevronLeft className={styles.arrowButtonIcon} />
            </button>

            <button
                className={classNames(styles.arrowButton, styles.arrowButtonRight)}
                onClick={() => {
                    onNextSlide()
                }}
            >
                <ChevronRight className={styles.arrowButtonIcon} />
            </button>
        </div>
    )
}

export default VideoSwiperControls