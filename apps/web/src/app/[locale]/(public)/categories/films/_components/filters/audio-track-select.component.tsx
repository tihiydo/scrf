'use client'

import { Check } from 'lucide-react';
import { useFiltersContext } from '../../query-context/use-filters-contenxt';
import styles from '../category-filters.module.scss';
import { Select, SelectOption } from '@/components/ui/select';
import { Languages } from '@/constants/langs';
import classNames from 'classnames';

type Props = {}

const AudioTrackSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = typeof searchParams.audio === 'undefined';

    const options: SelectOption<string>[] = Languages.map(lang => ({
        label: (
            <div className={styles.optionWithIcon}>
                {lang}
            </div>
        ),
        value: encodeURIComponent(lang)
    }));

    return (
        <Select
            selectAll
            unselectable
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            closeOnSelect
            value={searchParams.audio}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            search={{
                searchPlaceholder: 'Language'
            }}
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    audio: selected?.value,
                    page: 1
                })
            }}
            options={options}
        />
    )
}

export default AudioTrackSelect;