import { motion } from 'framer-motion';
import styles from './progress-bar.module.scss'
import ReactSlider from 'react-slider';
import classNames from 'classnames';

type Props = {
    currentTime: number;
    duration: number;
    continuousBuffered?: number;
    onBeforeChange?: () => void;
    onAfterChange?: (time: number) => void;
}

const ProgressBar = ({ currentTime, duration, continuousBuffered, onAfterChange, onBeforeChange }: Props) => {
    return (
        <div className={styles.progressBar}>
            <ReactSlider
                orientation='horizontal'
                className={styles.slider}
                trackClassName={styles.sliderTrack}
                thumbClassName={styles.sliderThumb}
                renderThumb={({ className, key, ...props }, state) => {
                    return <div key={key} className={classNames(className, styles.sliderThumb)} {...props}>
                    </div>
                }}

                renderTrack={({ className, key, ...props }, { index }) => {
                    return <div key={key} className={classNames(className, styles.sliderTrack, styles[`sliderTrack${index}`])} {...props}>

                    </div>
                }}
                value={currentTime}
                onBeforeChange={() => {
                    onBeforeChange?.()
                }}
                onAfterChange={(value) => {
                    onAfterChange?.(value)
                }}
                min={0}
                max={duration}
            />

            <motion.div
                className={styles.loaded}
                transition={{ duration: .1 }}
                animate={{
                    width: typeof continuousBuffered === 'number' ? `${(continuousBuffered / duration) * 100}%` : 0
                }}
            />

            <div
                className={styles.duration}
            />
        </div>
    )
};

export default ProgressBar