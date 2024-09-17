'use client'

import styles from '../category-filters.module.scss'
import { Select } from '@/components/ui/select';
import classNames from 'classnames';
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';
import { Check } from 'lucide-react';

type SortByOptions = 'imdb_rating' | 'by_novelty' | 'by_popularity';
type Props = {}


const SortBy = () => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = searchParams.sortBy === 'imdb_rating' || !searchParams.sortBy

    const options: { value: SortByOptions; label: string }[] = [
        { value: 'imdb_rating', label: 'According to IMDB' },
        { value: 'by_novelty', label: 'By novelty' },
        { value: 'by_popularity', label: 'By popularity' },
    ];

    return (
        <Select
            selectAll
            unselectable
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            closeOnSelect
            value={searchParams.sortBy}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            onChange={(option) => {
                setSearchParams({
                    ...searchParams,
                    sortBy: option?.value
                })
            }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            options={options.map((option) => ({
                ...option,
                label: (
                    <div className={styles.optionWithIcon}>
                        {option.label}
                    </div>
                )
            }))}
        />
    )
}

export default SortBy