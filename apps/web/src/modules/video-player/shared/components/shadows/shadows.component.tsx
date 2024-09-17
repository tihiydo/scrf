import classNames from 'classnames'
import { ComponentProps } from 'react'
import styles from './shadow.module.scss'

type Props = ComponentProps<'div'>

const ShadowTop = ({ className, ...props }: Props) => {
    return <div className={classNames(className, styles.top)} {...props} />
}

const ShadowBottom = ({ className, ...props }: Props) => {
    return <div className={classNames(className, styles.bottom)} {...props} />
}

export { ShadowBottom, ShadowTop }