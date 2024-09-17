import { ComponentProps } from 'react'
import styles from './quality-icon.module.scss'
import classNames from 'classnames';

type Props = ComponentProps<'div'>;

const QualityIcon = ({ className, ...props }: Props) => {
    return (
        <div className={classNames(className, styles.quality)} {...props}>
            HD
        </div>
    )
}

export default QualityIcon