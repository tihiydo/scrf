'use client'

import { Studio } from '@/entities/studio';
import styles from '../category-filters.module.scss'
import { Select, SelectOption } from '@/components/ui/select';
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';
import { StaticStudios } from '@/constants/studios';
import { Check } from 'lucide-react';


type Props = {
}

const StudioSelect = ({ }: Props) => {
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
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            value={searchParams.studio}
            className={styles.filterItemInput}
            placeholder="All"
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