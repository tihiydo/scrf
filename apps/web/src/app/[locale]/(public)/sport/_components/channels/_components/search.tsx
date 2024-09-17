'use client'

import { useRouter } from 'next/navigation';
import { ConfigProvider, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { tableEntity } from '@/entities/table-entity';
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react';
import { Broadcast } from '../../../entitities';
import styles from "../channels.module.scss"

type Props = {
    data: Broadcast[];
    setData: Dispatch<SetStateAction<Broadcast[]>>;
};

const SearchComponent = ({ data, setData }: Props) => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q')
    const router = useRouter(); // Get the router instance
    const [query, setQuery] = useState<string | null>(q);
    const [search, setSearch] = useState<string | undefined | null>(query);

    // Synchronize query with URL query parameter
    useEffect(() => {
        if (q !== null && q !== undefined) {
            setQuery(q)
            setSearch(q);
        }
    }, [q]);

    // Filter data whenever search changes
    useEffect(() => {
        if (data) {
            const filteredData = data.filter(
                (el) => {
                    if (search && search.length >= 1) {
                        return el.channelName.toLowerCase().includes(search?.toLowerCase() || '')
                    }
                    else {
                        return true
                    }
                }
            )
            setData(filteredData.sort((a, b) => {
                return a.channelName.localeCompare(b.channelName)
            }));
        }
    }, [search, setData, data]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: '#0D141F',
                    colorBorder: "#0D141F",
                    colorBorderBg: "#0D141F",
                    colorBorderSecondary: "#0D141F"
                },

            }}>
            <Input className={styles.placeholder} suffix={<Search />} placeholder='Search channel..'
                onChange={(e) => {
                    const value = e.target.value.trim();
                    setSearch(value);
                    setQuery(value);
                    router.push(`?qchannel=${value}`, { scroll: false })
                }} />
        </ConfigProvider>
    );
};

export default SearchComponent;