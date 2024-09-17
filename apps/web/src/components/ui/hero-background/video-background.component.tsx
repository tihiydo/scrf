import classNames from "classnames"
import styles from './video-background.module.scss'
import { ComponentProps } from "react"
import HeroBackground from "./hero-background.component";
import { LazyVideo } from "../lazy-video";
import { env } from "@/env";

type Props = TypedOmit<ComponentProps<'video'>, 'autoPlay' | 'loop' | 'src'> & {
    src: string;
}

const VideoBackground = ({ className, src, muted, ...props }: Props) => {
    return (
        <HeroBackground>
            <div className={styles.overlay} />

            {/* <video src={src} loop playsInline autoPlay muted={muted} preload="none" className={classNames(className, styles.video)} {...props} /> */}
            <LazyVideo loop playsInline autoPlay muted={muted} preload="none" src={src} className={classNames(className, styles.video)} {...props} />
        </HeroBackground>
    )
}

export default VideoBackground