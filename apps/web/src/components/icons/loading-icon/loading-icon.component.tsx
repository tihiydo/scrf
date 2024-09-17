import classNames from 'classnames'
import { LoaderCircle, LucideProps } from 'lucide-react'
import styles from './loading-icon.module.scss'

type Props = LucideProps

const LoadingIcon = ({ className, ...props }: Props) => {
    return (
        <LoaderCircle className={classNames(className, styles.icon)} />
    )
}

export default LoadingIcon;