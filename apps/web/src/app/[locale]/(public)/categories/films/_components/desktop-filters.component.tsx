'use client'

import styles from './category-filters.module.scss'
import classNames from 'classnames'
import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFiltersContext } from '../query-context/use-filters-contenxt'
import SortBy from './filters/sort-by.component'
import GenreSelect from './filters/genre.component'
import YearSelect from './filters/year-select.component'
import RatingSelect from './filters/rating-select'
import AudioTrackSelect from './filters/audio-track-select.component'
import { Button } from '@/components/ui/button'
import SubtitlesSelect from './filters/subtitles-select.component'
import StudioSelect from './filters/studio-select.component'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'

type Props = {

}


const DesktopFilters = ({ }: Props) => {
  const { searchParams, setSearchParams } = useFiltersContext();
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    // <div
    //   className={classNames(styles.desktopMotion)}
    // >

    <div className={styles.desktopContentWrapper}>
      <div>
        <div className={styles.desktopFiltersGrid}>
          <div className={styles.desktopItem}>
            <h6 className={styles.filterItemTitle}>
              Sort by
            </h6>
            <SortBy />
          </div>
          <div className={styles.desktopItem}>
            <h6 className={styles.filterItemTitle}>
              Genre
            </h6>
            <GenreSelect />
          </div>


          <div className={styles.desktopItem}>
            <h6 className={styles.filterItemTitle}>
              Rating
            </h6>
            <RatingSelect />
          </div>


        </div>

        <AnimatePresence initial={false}>
          {isShowMore ? (
            <motion.div
              key={'content'}
              initial={{ height: 0, overflow: 'visible' }}
              animate={{ height: "auto", overflow: 'visible' }}
              exit={{ height: 0, overflow: 'hidden' }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <div className={styles.moreFilters}>
                <div className={styles.desktopFiltersGrid}>
                  <div className={styles.desktopItem}>
                    <h6 className={styles.filterItemTitle}>
                      Year
                    </h6>
                    <YearSelect />
                  </div>

                  <div className={styles.desktopItem}>
                    <h6 className={styles.filterItemTitle}>
                      Audio Tracks
                    </h6>
                    <AudioTrackSelect />
                  </div>

                  <div className={styles.desktopItem}>
                    <h6 className={styles.filterItemTitle}>
                      Subtitles
                    </h6>
                    <SubtitlesSelect />
                  </div>

                  <div className={styles.desktopItem}>
                    <h6 className={styles.filterItemTitle}>
                      Studios
                    </h6>
                    <StudioSelect />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div>
        <button
          onClick={() => {
            setSearchParams({})
          }}
          className={styles.desktopReset}
        >
          Reset filters
        </button>

        <Button variant={'accent-outline'} size={'lg'} className={classNames(styles.showMore)} onClick={() => {
          setIsShowMore(!isShowMore)
        }}>
          {isShowMore ? 'Less' : 'More'} Filters
          <motion.div
            className={styles.showMoreMotion}
            animate={{ rotate: isShowMore ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <ChevronDownIcon className={classNames(styles.showMoreIcon)} />
          </motion.div>
        </Button>
      </div>

    </div>
    // </div>

  )
}

export default DesktopFilters