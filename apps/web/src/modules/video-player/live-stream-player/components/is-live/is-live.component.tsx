import classNames from 'classnames';
import styles from './styles.module.scss'

type Props = {
    isLive: boolean;
}

const IsLive = ({ isLive }: Props) => {
    return (
        <div className={styles.live}>
            <div className={classNames(styles.dot, isLive ? styles.dotActive : undefined)} />
            
            <p className={styles.text}>
                Live
            </p>
        </div>
    )
}

export default IsLive