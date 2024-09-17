'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, SearchIcon } from 'lucide-react';
import cn from 'classnames';
import { useEffect, useState } from 'react'
import styles from './select.module.scss'
import { useClickAway } from '@uidotdev/usehooks';
import { LoadingIcon } from '@/components/icons/loading-icon';

export type SelectOption<T> = {
    value: T;
    label: React.ReactNode | ((arg: { selected: boolean, disabled: boolean }) => React.ReactNode);
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

type Props<T> = {
    options: SelectOption<T>[];
    value?: Maybe<T>;
    search?: {
        searchPlaceholder?: string;
    };
    selectedIcon?: React.ReactNode;
    onChange?: (option: Maybe<SelectOption<T>>) => void;
    isLoading?: boolean;
    disabled?: boolean;
    defaultValue?: T;
    closeOnSelect?: boolean;
    unselectable?: boolean;
    className?: string;
    classNames?: Partial<{
        container: string;
        trigger: string;
        triggerIcon: string;
        menu: string;
        option: string;
        search: string;
        searchInput: string;
        searchIcon: string;
    }>;
    placeholder?: string;
    children?: React.ReactNode | ((option: Maybe<SelectOption<T>>) => React.ReactNode);
    selectAll?: boolean;
}

function Select<const T>({ options, selectedIcon, isLoading, disabled, className, onChange, value, defaultValue, classNames, search, unselectable = true, children, closeOnSelect = true, placeholder, selectAll = false }: Props<T>) {
    const [isOpened, setIsOpened] = useState(false);
    const [searchStr, setSearchStr] = useState('');
    const ref = useClickAway<HTMLDivElement>(() => {
        setIsOpened(false);
    })

    const selectedOption = options.find(opt => opt.value === (value ?? defaultValue));

    const handleOptionSelect = (option: SelectOption<T>) => {
        if (closeOnSelect) {
            setIsOpened(false);
        }

        if (option.value === selectedOption?.value && unselectable) {
            onChange?.(null)
            return
        }

        onChange?.(option);
    };

    const handleSelectAll = () => {
        onChange?.(options as any);
        setIsOpened(false);
    };

    options = search
        ? options
            .filter((option) => {
                const value = option.value as number | string;
                return value.toString().toLowerCase().includes(searchStr.toLowerCase())
            })
        : options

    useEffect(() => {
        if (isOpened) return;

        setSearchStr('')
    }, [isOpened])

    return (
        <div className={cn(styles.container, classNames?.container)} ref={ref}>
            <button
                disabled={disabled || isLoading}
                onClick={() => {
                    setIsOpened(!isOpened)
                }}
                className={cn(classNames?.trigger, styles.trigger, isLoading && styles.triggerLoading, className)}
            >
                {typeof children === 'function' ? (
                    children(options.find(opt => opt.value === value))
                ) : children ? (
                    children
                ) : selectedOption ? (
                    typeof selectedOption.label === 'function' ? (
                        selectedOption.label({
                            selected: value === selectedOption.value,
                            disabled: selectedOption.disabled!!,
                        })
                    ) : selectedOption.label
                ) : <div className={cn(styles.placeholder, 'no-scrollbar')}>
                    {placeholder ?? 'Select option'}
                </div>}

                {!isLoading ? (
                    <motion.div
                        className={styles.iconMotion}
                        animate={{ rotate: isOpened ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        <ChevronDown
                            className={cn(classNames?.triggerIcon, styles.triggerIcon)}
                        />
                    </motion.div>
                ) : (
                    <LoadingIcon
                        className={cn(classNames?.triggerIcon, styles.triggerIcon)}
                    />
                )}
            </button>

            <AnimatePresence>
                {isOpened ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(classNames?.menu, styles.menu)}
                    >
                        {search ? (
                            <>
                                <div className={cn(styles.search, classNames?.search)}>
                                    <SearchIcon className={cn(styles.searchIcon, classNames?.searchIcon)} />

                                    <input
                                        placeholder={search?.searchPlaceholder}
                                        disabled={disabled || isLoading}
                                        className={cn(styles.searchInput, classNames?.searchInput)}
                                        value={searchStr}
                                        onChange={(e) => {
                                            setSearchStr(e.target.value)
                                        }} />
                                </div>

                                {options.length ? (
                                    <div className={styles.searchSeparator}></div>
                                ) : null}
                            </>
                        ) : null}

                        <div className={styles.menuList}>
                            {selectAll && (
                                <button
                                    className={cn(classNames?.option, styles.option, styles.optionSelectAll)}
                                    onClick={(e) => {
                                        handleSelectAll()
                                    }}
                                >
                                    <div></div>
                                    Select All
                                </button>
                            )}
                            {options
                                .map(option => (
                                    <button
                                        className={cn(classNames?.option, styles.option, selectedOption?.value === option.value && styles.optionSelected
                                        )}
                                        key={option.value as string}
                                        disabled={disabled || option.disabled}
                                        onClick={(e) => {
                                            option.onClick?.(e)
                                            handleOptionSelect(option);
                                        }}
                                    >
                                        {selectedOption?.value === option.value ? selectedIcon : <div></div>}

                                        {typeof option.label === 'function' ? (
                                            option.label({
                                                selected: selectedOption?.value === option.value,
                                                disabled: option.disabled!!,
                                            })
                                        ) : option.label}
                                    </button>
                                ))
                            }
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div >
    )
}

export default Select