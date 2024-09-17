import { GlobalSearch } from '@/api/requests/search'
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from 'antd';
import React, { ComponentProps, useState } from 'react'
import styles from './styles.module.scss'
import SelectCard from './select-card.component';
import { Fiction } from '@/entities/fiction';

type Props = {
    selectedFictions: Fiction[];
    onChange?: (fictions: Fiction[]) => void;
}

const FictionSelect = ({ selectedFictions, onChange }: Props) => {
    const [searchStr, setSearchStr] = useState<string>('');
    const debouncesSearch = useDebounce(searchStr, 1000);

    const searchQuery = GlobalSearch.useQuery({
        searchString: debouncesSearch,
        params: {
            entities: ['fiction']
        }
    });



    const handleCardClick: ComponentProps<typeof SelectCard>['onClick'] = (fiction) => {
        const fictionId = fiction.id;
        if (!fictionId) return;


        const selected = selectedFictions.some(fic => fic.id === fictionId);
        let newSelected = selectedFictions;
        if (selected) {
            newSelected = newSelected.filter(f => f.id !== fictionId)
        } else {
            newSelected = [...newSelected, fiction]
        }

        onChange?.(newSelected);
    }


    return (
        <div className={styles.fictionSelect}>
            <div className={styles.search}>
                <Input
                    className={styles.searchInput}
                    value={searchStr}
                    placeholder='Search for Serial or Movie'
                    size='large'
                    onChange={(e) => {
                        setSearchStr(e.target.value)
                    }}
                />
                <p className={styles.searchDescription}>Enter at least 3 characters</p>
            </div>


            <div className={styles.content}>

                {searchQuery.data?.fictions?.map(f => (
                    <SelectCard
                        key={f.id}
                        selected={selectedFictions.some(fic => fic.id === f.id)}
                        fiction={f}
                        onClick={handleCardClick}
                    />
                ))}
            </div>
        </div>
    )
}

export default FictionSelect