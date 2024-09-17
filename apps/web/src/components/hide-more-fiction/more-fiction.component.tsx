import { ComponentProps } from 'react'
import { FictionSwiper } from '../swipers'
import { MoreFictionAccrodion } from '../more-fiction-accordion'
import styles from './more-fiction.module.scss'

type Props = {
    sliders: {
        title: string;
        fictionSlider: ComponentProps<typeof FictionSwiper>
    }[]
}

const MoreFiction = ({ sliders }: Props) => {
    return (
        <MoreFictionAccrodion>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    {sliders.map(slider => (
                        <div className={styles.item} key={slider.title}>
                            <h5 className={styles.itemTitle}>{slider.title}</h5>

                            <FictionSwiper {...slider.fictionSlider} />
                        </div>
                    ))}
                </div>
            </div>
        </MoreFictionAccrodion>
    )
}

export default MoreFiction