import { Check } from 'lucide-react';
import { useFiltersContext } from '../../query-context/use-filters-contenxt';
import styles from '../category-filters.module.scss';
import { useGenres } from '../../_hooks/use-genres';
import { Select } from '@/components/ui/select';
import classNames from 'classnames';

type Genre = {
    slug: string;
    genreName: string;
};

const GenreSelect = () => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const genresQuery = useGenres(); // Ensure this hook returns the correct genre data
    const isDefault = typeof searchParams.genre === 'undefined';

    const options: { value: string; label: string }[] = genresQuery.data
        ? genresQuery.data.map((genre: Genre) => ({
            value: genre.slug,
            label: genre.genreName
        }))
        : [];

    return (
        <Select
            selectAll
            unselectable
            closeOnSelect
            value={searchParams.genre}
            className={classNames(styles.filterItemInput)}
            placeholder="All"
            selectedIcon={<Check color='#faff00' width={21} height={21} />}
            onChange={(option) => {
                setSearchParams({
                    ...searchParams,
                    genre: option?.value,
                    page: 1
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

export default GenreSelect;
