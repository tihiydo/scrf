'use client';
import styles from './wrapper-block.module.scss';
import { ComponentProps } from 'react';
import classNames from 'classnames';






type Props = ComponentProps<'div'>

export default function WrapperBlock({ children, className, ...props }: Props) {

    return <div {...props} className={classNames(styles.section, className)}>
        {children}
    </div>
}

