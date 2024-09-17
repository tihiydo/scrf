import { Check } from 'lucide-react';
import { useFiltersContext } from '../../query-context/use-filters-contenxt';
import styles from '../category-filters.module.scss';
import { Select } from '@/components/ui/select';

import classNames from 'classnames';

type SortByOptions = 'imdb_rating' | 'by_novelty' | 'by_popularity';

const SortBy = () => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = !searchParams.sortBy;

    const options: { value: SortByOptions; label: string }[] = [
        { value: 'imdb_rating', label: 'According to IMDB' },
        { value: 'by_novelty', label: 'By novelty' },
        { value: 'by_popularity', label: 'By popularity' },
    ];

    return (
        <Select
            selectAll
            unselectable
            closeOnSelect
            value={searchParams.sortBy as SortByOptions | undefined}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            onChange={(option) => {
                setSearchParams({
                    ...searchParams,
                    sortBy: option?.value as SortByOptions
                });
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
    );
}

export default SortBy;
