import { ComponentProps } from 'react'
import styles from './skeleton.module.scss'
import classNames from 'classnames'

type Props = ComponentProps<'div'>

const Skeleton = ({ className, ...props }: Props) => {
    return (
        <div className={classNames(className, styles.skeleton)} {...props} />
    )
}

export default Skeleton