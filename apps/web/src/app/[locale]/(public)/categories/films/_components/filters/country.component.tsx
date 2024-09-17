'use client'

import React, { useState } from 'react'
import { useFiltersContext } from '../../query-context/use-filters-contenxt'
import styles from '../category-filters.module.scss'
import { StarIcon, } from 'lucide-react';
import { Select, SelectOption } from '@/components/ui/select';

type Props = {}

const CountrySelect = (props: Props) => {
    const [value, setValue] = useState<string>();

    const isDefault = !value;

    const options = [
        { value: 'ukrainer', label: 'Ukraine' },
        { value: 'usa', label: 'USA' },
        { value: 'germany', label: 'Germany' },
        { value: 'france', label: 'France' },
        { value: 'united_kingdom', label: 'United Kingdom' },
        { value: 'italy', label: 'Italy' },
    ]

    return (
        <Select
            selectAll
            value={value}
            onChange={(newVal) => {
                setValue(newVal?.value)
            }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            className={styles.filterItemInput}
            placeholder="All"

            options={options}
        />
    )
}

export default CountrySelect