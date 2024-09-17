'use client'

import { useFiltersContext } from '../../query-context/use-filters-contenxt'
import styles from '../category-filters.module.scss'
import { Select, SelectOption } from '@/components/ui/select';
import { Languages } from '@/constants/langs';
import { Check } from 'lucide-react';
import classNames from 'classnames';

type Props = {}

const SubtitlesSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const isDefault = typeof searchParams.subtitles === 'undefined'

    const options: SelectOption<string>[] = [
        ...Languages.map(lang => ({
            label: (
                <div className={styles.optionWithIcon}>
                    {lang}
                </div>
            ),
            value: encodeURIComponent(lang)
        }))
    ]

    return (
        <Select
            selectAll
            unselectable
            closeOnSelect
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            value={searchParams.subtitles}
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
                    subtitles: selected?.value,
                    page: 1
                })
            }}
            options={options}
        />
    )
}

export default SubtitlesSelect