import { Skeleton } from "@/components/ui/skeleton";
import styles from "./fiction-card.module.scss";
import classNames from "classnames";

type Props = {
    className?: string;
}


export const FictionSkeletonCard = ({ className }: Props) => {

    return (
        <div
            className={classNames(styles.container, className)}
        >
            <div className={classNames(styles.card, styles.skeletonCard)}>
                {/* </div> */}
                <Skeleton className={styles.skeletonTitle} />

                <div className={styles.info}>
                    <Skeleton className={styles.skeletonAbout} />
                    <Skeleton className={styles.skeletonAbout} />
                    <Skeleton className={styles.skeletonAbout} />
                    <Skeleton className={styles.skeletonAbout} />
                </div>
            </div>
        </div>
    );
};