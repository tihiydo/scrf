'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './search.module.scss'
import { GlobalSearch } from '@/api/requests/search';
import { SearchInput } from '../search-input';
import { Results } from '../results';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchXIcon } from 'lucide-react';
import { LoadingIcon } from '@/components/icons/loading-icon';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { globalSearchStore } from '@/stores/global-search-store';
import { observer } from 'mobx-react-lite';
import { InputRef } from 'antd';


type Props = {
    className?: string;
}

const MobileSearch = ({ className }: Props) => {
    const inputRef = useRef<InputRef>(null);
    const debouncedSearchStr = useDebounce(globalSearchStore.searchStr, 1000)

    const searchQuery = GlobalSearch.useQuery({
        searchString: debouncedSearchStr,
        params: {
            entities: ['movie', 'serial']
        }
    });

    useEffect(() => {
        const handleOverflow = () => {
            if (globalSearchStore.opened) {
                // Save the current scroll position
                const scrollPosition = window.scrollY;

                // Apply styles to prevent scrolling
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollPosition}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';

                // Adjust the top property to account for any changes in the layout
                document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
            } else {
                // Restore the original scroll position and styles
                const scrollPosition = parseInt(document.body.style.top || '0', 10) * -1;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';

                window.scrollTo(0, scrollPosition);
            }
        };

        handleOverflow();
    }, [globalSearchStore.opened]);

    const hasData = !!searchQuery.data?.movies?.length || !!searchQuery.data?.serials?.length

    useEffect(() => {
        if (globalSearchStore.opened) {
            inputRef.current?.focus();
        }
    }, [globalSearchStore.opened])

    return (
        <AnimatePresence>
            {globalSearchStore.opened ? (
                <motion.div
                    key={'overlay'}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    initial={{
                        opacity: 0
                    }}
                    className={classNames(styles.overlay, styles.container)}
                    transition={{ duration: 1, type: 'spring' }}
                />
            ) : null}

            {globalSearchStore.opened ? (
                <motion.div
                    key={'search-content'}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    exit={{
                        y: 250,
                        opacity: 0
                    }}
                    initial={{
                        y: 250,
                        opacity: 0
                    }}
                    className={classNames(styles.body, styles.container)}
                    transition={{ duration: 1, type: 'spring' }}
                >
                    <SearchInput
                        ref={inputRef}
                        className={styles.input}
                        searchStr={globalSearchStore.searchStr}
                        onChange={(str) => globalSearchStore.setSearchStr(str)}
                        onClose={() => {
                            globalSearchStore.toggleOpen(false)
                        }}
                    />


                    <div className={classNames(styles.content, 'no-scrollbar')} >
                        {searchQuery.isFetching ? (
                            <div className={styles.loading}>
                                <LoadingIcon className={styles.loadingIcon} />
                            </div>
                        ) : (
                            hasData ? (
                                <Results
                                    data={searchQuery.data}
                                />
                            ) : (
                                <div className={styles.notFoundWrapper}>
                                    <div className={styles.notFound}>
                                        <SearchXIcon className={styles.notFoundIcon} />

                                        <p className={styles.notFoundText}>Nothing Found</p>
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                </motion.div>
            ) : null}

        </AnimatePresence>
    )
}

export default observer(MobileSearch)