'use client';
import classNames from 'classnames';
import styles from './resend-btn.module.scss';

type Props = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const ResendBtn = ({ children, className, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={classNames(className, styles.resendBtn)}
        >
            {children}
        </button>
    )
}

export default ResendBtn