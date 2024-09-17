'use client'

import styles from '../category-filters.module.scss'
import { useGenres } from '../../_hooks/use-genres';
import { Select, SelectOption } from '@/components/ui/select';
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';
import { Check } from 'lucide-react';


type Genre = {
    slug: string;
    genreName: string;
};

type Props = {}

const GenreSelect = (props: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();

    const genresQuery = useGenres();
    const isDefault = typeof searchParams.genre === 'undefined'


    const options: { value: string; label: string }[] = genresQuery.data
        ? genresQuery.data.map((genre: Genre) => ({
            value: genre.slug,
            label: genre.genreName
        }))
        : [];



    return (
        <Select
        selectAll
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            isLoading={genresQuery.isPending}
            disabled={genresQuery.isPending}
            value={searchParams.genre}
            className={styles.filterItemInput}
            placeholder="All"
            classNames={{
                trigger: !isDefault ? styles.filterItemInputTriggerActive : ''
            }}
            onChange={(selected) => {
                setSearchParams({
                    ...searchParams,
                    genre: selected?.value,
                    page: 1
                })
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

export default GenreSelect