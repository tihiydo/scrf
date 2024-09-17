'use client'

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import styles from './search-input.module.scss'
import { Input, InputRef } from 'antd';
import { forwardRef } from 'react';

type Props = {
    value: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
    onClose?: () => void;
}

const SearchInput = forwardRef<InputRef, Props>(({
    onChange,
    value,
    onClose
}, ref) => {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
            }}

            className={styles.search}
        >
            <Input
                ref={ref}
                value={value}
                onChange={(e) => {
                    onChange?.(e.target.value ?? '')
                }}
                className={styles.input}
                type='text'
                placeholder='Search...'
            />

            <Button
                className={styles.btn}
                size={'icon'}
                type='button'
                variant={'pimary'}
                onClick={() => {
                    onClose?.()
                }}
            >
                <XIcon />
            </Button>
        </form>
    )
})

export default SearchInput