'use client'

import { Button } from '@/components/ui/button'
import { Drawer } from 'vaul'
import styles from './mobile-filters.module.scss'
import { Check, CheckCheckIcon, EyeIcon, HeartIcon, XIcon } from 'lucide-react'
import FilterBtn from './mobile-btn'
import classNames from 'classnames'
import { useMediaQuery } from '@react-hook/media-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickAway, useHover } from '@uidotdev/usehooks'
import { AddListFiction } from '@/api/requests/lists/add-fiction'
import { GetFictionLists } from '@/api/requests/lists/get-fiction-lists'
import { RemoveListFiction } from '@/api/requests/lists/remove-fiction'
import { List } from '@/entities/lists'
import { isSerial } from '@/utils/fiction'
import { message } from 'antd'
import { useState, useEffect } from 'react'
import { Movie } from '@/entities/movie'
import { Serial } from '@/entities/serial'


type RadioProps = {
    isChecked: boolean;
    value: string;
}

const Radio = ({ isChecked, value }: RadioProps) => {
    console.log(isChecked)
    return (
        <div className={styles.radio__container}>
            <input type="checkbox" checked={isChecked} value={value} />
            <span className={styles.radio__checkmark}></span>
            <AnimatePresence>
                {isChecked && (
                    <motion.div
                        className={styles.galochka}
                        exit={{ opacity: 1 }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            delay: 0.1,
                            duration: 0.2,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                    >
                        < Check />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


type Props = {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    fiction: (Movie | Serial)
}

const MobileFilters = ({ isOpened, setOpen, fiction }: Props) => {
    // const isLarge = useMediaQuery('screen and (min-width: 768px')

    // if (isLarge) return;
    const [ref, hovering] = useHover()


    const [includedLists, setIncludedLists] = useState<Record<string, boolean>>({});
    const fictionType: 'serial' | 'movie' = isSerial(fiction)
        ? 'serial'
        : 'movie'

    const useAddToList = AddListFiction.useMutation({
        onError: (error) => {
            message.error(error.response?.data.message)
        },
        onSuccess: ({ list }) => {
            message.success(`"${fiction.title}" added to the list "${list.name}"`)
            listsQuery.refetch();
        }
    })

    const useRemoveFromList = RemoveListFiction.useMutation({
        onError: (error) => {
            message.error(error.response?.data.message)
        },
        onSuccess: ({ list }) => {
            message.success(`"${fiction.title}" from the list "${list.name}"`)
            listsQuery.refetch();
        }
    })

    const listsQuery = GetFictionLists.useQuery({
        fictionImdbid: fiction.imdbid
    })

    const isIncluded = (slug: string, lists: List[]) => {
        return lists.some(list => list.slug === slug)
    }

    useEffect(() => {
        if (!listsQuery.data) return;
        const lists = listsQuery.data.lists;
        setIncludedLists(() => ({
            saved: isIncluded('saved', lists),
            watching: isIncluded('watching', lists),
            viewed: isIncluded('viewed', lists),
        }))
    }, [listsQuery.data])


    const [isOpen, setIsOpen] = useState(false);
    const clickAwayRef = useClickAway<HTMLDivElement>((e) => {
        setIsOpen(false);
    });

    const onChange = (list: string) => {
        const isAdded = includedLists[list];

        if (isAdded) {
            useRemoveFromList.mutate({
                fictionImdbid: fiction.imdbid,
                type: fictionType,
                slug: list
            })
        } else {
            useAddToList.mutate({
                fictionImdbid: fiction.imdbid,
                type: fictionType,
                slug: list
            })

        }
    };

    return (
        <Drawer.Root open={isOpened} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <FilterBtn isOpened={isOpened} toggle={() => setOpen(!isOpened)} />
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className={styles.mobileOverlay} />
                <Drawer.Content className={classNames(styles.filtersMobile, styles.mobile)}>
                    <div className={styles.filtersMobileDrawerContent}>
                        <div>
                            <div className={styles.filtersMobileHeader}>
                                <h4 className={styles.filtersMobileTitle}>MY LIST</h4>

                                <Drawer.Close>
                                    <Button className={styles.filtersMobileClose} size={'icon'} variant={'ghost'}>
                                        <XIcon />
                                    </Button>
                                </Drawer.Close>
                            </div>
                        </div>
                        <div className={styles.filtersMobileContent}>
                            <div className={styles.filterItem}>
                                <div className={styles.item} onClick={() => onChange("saved")}>
                                    <div>
                                        <HeartIcon className={styles.itemIcon} />
                                        <p className={styles.itemText}>Saved</p>
                                    </div>
                                    <Radio value="saved" isChecked={!!includedLists["saved"]} />
                                </div>

                                <div className={styles.item} onClick={() => onChange("watching")}>
                                    <div>
                                        <EyeIcon className={styles.itemIcon} />
                                        <p className={styles.item__text}>Watching</p>
                                    </div>
                                    <Radio value="watching" isChecked={!!includedLists["watching"]} />
                                </div>

                                <div className={styles.item} onClick={() => onChange("viewed")}>
                                    <div>
                                        <CheckCheckIcon className={styles.itemIcon} />
                                        <p className={styles.itemText}>Viewed</p>
                                    </div>
                                    <Radio value="viewed" isChecked={!!includedLists["viewed"]} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root >
    )
}

export default MobileFilters