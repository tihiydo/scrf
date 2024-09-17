import { Link } from '@/i18n/navigation';
import styles from './list-card.module.scss';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';

type ListType = 'saved' | 'viewed' | 'watching';

const listData: Record<ListType, {
    link: string;
    title: string;
}> = {
    saved: {
        title: 'Saved',
        link: '/lists/saved'
    },
    viewed: {
        title: 'Viewed',
        link: '/lists/viewed'

    },
    watching: {
        title: 'Watching',
        link: '/lists/watching'
    }
}


type Props = {
    type: ListType;
}

const ListCard = ({ type }: Props) => {
    const listItemData = listData[type];

    return (
        <Link href={listItemData.link} >
            <WrapperBlock className={styles.card}>
                <h2 className={styles.cardTitle}>
                    {listItemData.title}
                </h2>
            </WrapperBlock>
        </Link>
    )
}

export default ListCard