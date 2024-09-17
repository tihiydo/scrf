import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import styles from './bread-crumbs.module.scss'
import classNames from 'classnames';

type Props = {
    className?: string;
    items: {
        link: string;
        content: React.ReactNode
        className?: string
    }[]
    separator?: React.ReactNode
}

const BreadCrumbs = ({ items, separator, className }: Props) => {
    return (
        <div className={classNames(styles.breadCrumbs, className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <>
                        <Link href={item.link} className={styles.link}>
                            {item.content}
                        </Link>

                        {true ? (
                            separator ?? <ChevronRight className={styles.separator} />
                        ) : null}
                    </>
                )
            })}
        </div>
    )
}

export default BreadCrumbs