import { ActorsSwiper } from '@/components/swipers'
import classNames from 'classnames'
import styles from './cast.module.scss';
import { Personality } from '@/entities/pesonality';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';

type Props = {
    cast: Personality[];
}

const CastSection = ({ cast }: Props) => {
    return (
        <WrapperBlock className={classNames(
            "container",
            // styles.section
        )}>

            <h3 className={styles.title}>THE CAST</h3>

            <ActorsSwiper actors={cast} />
        </WrapperBlock>
    )
}

export default CastSection