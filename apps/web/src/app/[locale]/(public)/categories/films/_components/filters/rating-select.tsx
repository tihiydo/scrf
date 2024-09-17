'use client'

import React from 'react'
import { useFiltersContext } from '../../query-context/use-filters-contenxt'
import styles from '../category-filters.module.scss'
import { StarIcon, Check } from 'lucide-react';
import { Select, SelectOption } from '@/components/ui/select';
import classNames from 'classnames';

type Props = {}

const RatingSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = typeof searchParams.rating === 'undefined'

    const options: SelectOption<number>[] = Array(9)
        .fill(null)
        .map((el, index, { length }) => {
            const rating = length - index;
            return {
                label: (
                    <div className={styles.optionWithIcon}>
                        <div className={styles.ratingItem}>
                            <p className={styles.ratingItemText}>More than {rating}</p>
                            <StarIcon className={styles.ratingItemIcon} />
                        </div>
                    </div>
                ),
                value: rating
            }
        });

    return (
        <Select
            selectAll
            unselectable
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            closeOnSelect
            value={searchParams.rating}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            search={{
                searchPlaceholder: 'Rating'
            }}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    rating: selected?.value,
                    page: 1
                })
            }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            options={options}
        />
    )
}

export default RatingSelect