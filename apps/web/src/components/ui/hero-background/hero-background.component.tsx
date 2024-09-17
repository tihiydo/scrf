import classNames from 'classnames';
import styles from './hero-background.module.scss';

type Props = {
    children: React.ReactNode;
    className?: string;
}
const HeroBackground = ({ children, className }: Props) => {
    return (
        <div className={classNames(styles.bg, className)}>
            {children}
        </div>
    )
}

export default HeroBackground