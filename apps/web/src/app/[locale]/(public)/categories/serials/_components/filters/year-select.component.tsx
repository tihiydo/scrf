'use client'

import React from 'react'
import styles from '../category-filters.module.scss'
import { Select, SelectOption } from '@/components/ui/select';
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';
import { Check } from 'lucide-react';


type Props = {}

const YearSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();

    const isDefault = typeof searchParams.releaseYear === 'undefined'

    const options = Array(50).fill(null).map((_, index) => {
        const year = new Date().getFullYear() - index;

        return {
            label: (
                <div className={styles.optionWithIcon}>
                    {year}
                </div>
            ),
            value: year
        }
    });


    return (
        <Select
            selectAll
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            search={{ searchPlaceholder: 'Type a year' }}
            value={searchParams.releaseYear}
            className={styles.filterItemInput}
            placeholder="All"
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    releaseYear: selected?.value,
                    page: 1
                })
            }}
            options={options}
        />
    )
}

export default YearSelect