'use client'

import React from 'react'
import styles from '../category-filters.module.scss'
import { Check, StarIcon, } from 'lucide-react';
import { Select, SelectOption } from '@/components/ui/select';
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';

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
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            value={searchParams.rating}
            className={styles.filterItemInput}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    rating: selected?.value,
                    page: 1
                })
            }}
            placeholder="All"
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            options={options}
        />
    )
}

export default RatingSelect