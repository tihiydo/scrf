'use client'

import { useRouter } from 'next/navigation';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { tableEntity } from '@/entities/table-entity';
import { useSearchParams } from 'next/navigation'

type Props = {
  data: tableEntity[];
  setData: Dispatch<SetStateAction<tableEntity[]>>;
};

const SearchComponent = ({ data, setData }: Props) => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q')
    const router = useRouter(); // Get the router instance
    const [query, setQuery] = useState<string | null>(q);
    const [search, setSearch] = useState<string | undefined | null>(query);

    function matchesIMDBIDPattern(str: string): boolean 
    {
        const pattern = /^[a-zA-Z]{2}\d+$/;
        return pattern.test(str);
    }

    // Synchronize query with URL query parameter
    useEffect(() => {
        if (q !== null && q !== undefined) {
            setQuery(q)
            setSearch(q); // Update search state to reflect query
        }
    }, [q]);

    // Filter data whenever search changes
    useEffect(() => 
    {
        if (data) {
            const filteredData = data.filter(
            (el) =>
            {
                if(search && search.length >= 1)
                {
                    if(matchesIMDBIDPattern(search))
                    {
                        return el.imdbid.toLowerCase().includes(search?.toLowerCase() || '')
                    }
                    else
                    {
                        return el.title.toLowerCase().includes(search?.toLowerCase() || '')
                    }
                }
                else
                {
                    return true
                }
            }
            ).sort((a, b) =>
            {
                return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
            })
            setData(filteredData);
        }
    }, [search, setData, data]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <p style={{ textTransform: 'uppercase', fontSize: '17px', marginBottom: '6px' }}>Find entity</p>
            <Input
                style={{ height: '44px', width: '300px' }}
                suffix={<SearchOutlined />}
                value={search || ''} // Set value to search or empty string
                onChange={(e) => {
                    const value = e.target.value.trim();
                    setSearch(value);
                    setQuery(value); 
                    router.push(`?q=${value}`)
                }}
            />
        </div>
    );
};

export default SearchComponent;
