'use client'

import { StaticStudios } from '@/constants/studios';
import { useFiltersContext } from '../../query-context/use-filters-contenxt'
import styles from '../category-filters.module.scss'
import { Select, SelectOption } from '@/components/ui/select';
import { Check } from 'lucide-react';
import classNames from 'classnames';

type Props = {}

const StudioSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = typeof searchParams.studio === 'undefined'

    const options: SelectOption<string>[] = [
        ...Object.values(StaticStudios).map(studio => ({
            label: (
                <div className={styles.optionWithIcon}>
                    {studio}
                </div>
            ),
            value: studio
        }))
    ];

    return (
        <Select
            selectAll
            unselectable
            closeOnSelect
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            value={searchParams.studio}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            defaultValue='All'
            search={{
                searchPlaceholder: 'Search Studio'
            }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    studio: selected?.value,
                    page: 1
                })
            }}
            options={options}
        />
    )
}

export default StudioSelect