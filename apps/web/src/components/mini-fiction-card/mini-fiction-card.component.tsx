import { Link } from '@/i18n/navigation'
import styles from './mini-fiction-card.module.scss'
import Image from 'next/image'

type Props = {
    previewImage?: string;
    title: string;
    description?: string;
    link: string;
    onClick?: () => void;
}

const MiniFictionCard = ({ previewImage, description, title, link, onClick }: Props) => {
    return (
        <Link
            href={link}
            className={styles.item}
            onClick={() => {
                onClick?.()
            }}
        >
            {previewImage ? (
                <div className={styles.imageContainer}>
                    <Image className={styles.image} unoptimized src={previewImage} alt={title} fill />
                </div>
            ) : (null)}

            <div className={styles.content}>
                <h6 className={styles.title}>{title}</h6>
                <p className={styles.descr}>{description}</p>
            </div>
        </Link>
    )
}

export default MiniFictionCard