'use client'

import { Button } from '@/components/ui/button'
import { Drawer } from 'vaul'
import styles from './category-filters.module.scss'
import { XIcon } from 'lucide-react'
import FilterBtn from './filter-btn.component'
import classNames from 'classnames'
import SortBy from './filters/sort-by.component'
import GenreSelect from './filters/genre.component'
import YearSelect from './filters/year-select.component'
import RatingSelect from './filters/rating-select'
import { Select } from '@/components/ui/select'
import CountrySelect from './filters/country.component'
import SubtitlesSelect from './filters/subtitles-select.component'
import AudioTrackSelect from './filters/audio-track-select.component'
import StudioSelect from './filters/studio-select.component'
import { useFiltersContext } from '../query-context/use-filters-contenxt'
import { useMediaQuery } from '@/hooks/use-media-query'


type Props = {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
}

const MobileFilters = ({ isOpened, setOpen }: Props) => {
    const isLarge = useMediaQuery('screen and (min-width: 768px')
    const { searchParams, setSearchParams } = useFiltersContext();


    if (isLarge) return;

    return (
        <>
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
                                    <h4 className={styles.filtersMobileTitle}>Filters</h4>


                                    <div className={styles.filtersMobileHeaderLeft}>
                                        <button
                                            onClick={() => {
                                                setSearchParams({})
                                            }}
                                            className={styles.filtersMobileHeaderLeft}
                                        >
                                            Reset filters
                                        </button>

                                        <Drawer.Close>
                                            <Button className={styles.filtersMobileClose} size={'icon'} variant={'ghost'}>
                                                <XIcon />
                                            </Button>
                                        </Drawer.Close>
                                    </div>

                                </div>

                                <div className={styles.filtersMobileContent}>
                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Sort by
                                        </h6>
                                        <SortBy />
                                    </div>
                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Genre
                                        </h6>
                                        <GenreSelect />
                                    </div>

                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Year
                                        </h6>
                                        <YearSelect />
                                    </div>

                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Rating
                                        </h6>
                                        <RatingSelect />
                                    </div>

                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Audio Tracks
                                        </h6>
                                        <AudioTrackSelect />
                                    </div>


                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Subtitles
                                        </h6>
                                        <SubtitlesSelect />
                                    </div>

                                    <div className={styles.filterItem}>
                                        <h6 className={styles.filterItemTitle}>
                                            Studios
                                        </h6>
                                        <StudioSelect />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    )
}

export default MobileFilters

