import classNames from "classnames"
import Image, { ImageProps } from "next/image"
import styles from './image-background.module.scss'
import HeroBackground from "./hero-background.component"

type Props = ImageProps & {
    overlay?: {
        opacity?: number;
    }
}

const ImageBackground = ({ overlay, className, fill = true, ...props }: Props) => {
    return (
        <HeroBackground className={classNames(styles.heroBackground)}>
            <Image className={classNames(className, styles.img)} fill={fill}  {...props} />

            {overlay ? (
                <div className={styles.heroBackgroundOverlay}></div>
            ) : null}
        </HeroBackground>
    )
}

export default ImageBackground