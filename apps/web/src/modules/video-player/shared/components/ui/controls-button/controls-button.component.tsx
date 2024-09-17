import classNames from 'classnames';
import styles from './controls-button.module.scss';
import { ComponentProps } from 'react';


type Props = ComponentProps<'button'>

const ControlsButton = ({ className, ...props }: Props) => {
    return (
        <button className={classNames(styles.btn, className)} {...props} />
    )
}

export default ControlsButton