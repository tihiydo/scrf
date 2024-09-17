import React from 'react';
import styles from './text-logo.module.scss'
import classNames from 'classnames';

type Props = {
    className?: string;
    text?: string;
};

const TextLogo = ({ className }: Props) => {
    return (
        <div className={classNames(styles.textLogo, className)}>
            <div className={styles.textContainer}>
                <span className={styles.visibleText}>SCREENIFY</span>
            </div>
        </div>
    );
};

export default TextLogo; 