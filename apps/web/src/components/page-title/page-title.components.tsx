import { ComponentProps } from 'react'
import styles from './page-title.module.scss'
import classNames from 'classnames'

type Props = ComponentProps<'h1'> & {
    bottomSpacing?: boolean;
    itemsCount?: number;
}

const PageTitle = ({ className, itemsCount, bottomSpacing = false, children, ...props }: Props) => {
    return (
        <h1 className={classNames(styles.title, bottomSpacing ? styles.bottomSpacing : null, className)} {...props}>
            <p className={styles.titleText}>{children}</p>
            {typeof itemsCount === 'number' ? (
                <>
                    <div className={styles.titleDot}></div>
                    <p className={classNames(styles.titleText, styles.titleCount)}>{itemsCount}</p>
                </>
            ) : null}
        </h1>
    )
}

export default PageTitle