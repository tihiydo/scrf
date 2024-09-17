import { Check } from 'lucide-react';
import { useFiltersContext } from '../../query-context/use-filters-contenxt';

import styles from '../category-filters.module.scss';

import { Select, SelectOption } from '@/components/ui/select';

import classNames from 'classnames';

const YearSelect = () => {

    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = typeof searchParams.releaseYear === 'undefined';

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
            unselectable
            closeOnSelect
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            value={searchParams.releaseYear}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            search={{ searchPlaceholder: 'Year' }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            onChange={selected => {
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