import { secondsToRuntimeString } from '@/utils/time'
import styles from './current-time.module.scss'
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    currentTime: number;
    duration: number;
    isLoading?: boolean;
}

const CurrentTime = ({ currentTime, duration, isLoading }: Props) => {

    if (isLoading) {
        return <div className={styles.skeleton}>
            <Skeleton className={styles.skeletonItem} /> / <Skeleton className={styles.skeletonItem} />
        </div>
    }
    return (
        <div className={styles.runtime}>
            <p>
                {secondsToRuntimeString(currentTime)}
            </p>
            <p>/</p>
            <p>{secondsToRuntimeString(duration)}</p>
        </div >
    )
}

export default CurrentTime