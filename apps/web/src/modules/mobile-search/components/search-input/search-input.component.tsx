'use client'

import classNames from 'classnames';
import styles from './search-input.module.scss'
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { Input, InputRef } from 'antd';

type Props = {
    onChange?: (searchStr: string) => void;
    onClose?: () => void;
    searchStr: string;
    className?: string;
}

const SearchInput = forwardRef<InputRef, Props>(({ searchStr, onChange, onClose, className }, ref) => {
    return (
        <div className={classNames(styles.container, className)}>
            <Input
                ref={ref}
                placeholder='Search...'
                className={styles.input}
                value={searchStr}
                onChange={(e) => onChange?.(e.target.value)}
            />

            <Button
                size={'icon'}
                variant={'ghost'}
                className={styles.clear}
                onClick={() => {
                    onClose?.()
                }}
            >
                <XIcon className={styles.clearIcon} />
            </Button>
        </div>
    )
})

export default SearchInput