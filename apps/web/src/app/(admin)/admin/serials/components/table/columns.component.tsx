'use client'

import { Movie } from '@/entities/movie';
import { Serial } from '@/entities/serial';
import { tableEntity } from '@/entities/table-entity';
import { DownloadDataTable, MoviesData } from '@/types/downloads';
import { formatDate } from '@/utils/time';
import { Button, type TableColumnsType } from 'antd';
import Link from 'next/link';

export const columns: TableColumnsType<tableEntity> = [
    {
        title: 'IM.DB ID',
        dataIndex: 'imdbid',
        key: 'id',
        render: (id) => {
            return id;
        }
    },
    {
        title: 'Title',
        key: 'title',
        render: (_, movie) => {
            return movie.title;
        }
    },
    {
        title: 'Added at',
        dataIndex: 'addedAt',
        key: 'addedAt',
        render: (addedAt, movie) => 
        {
            return formatDate(new Date(movie.addedAt));
        }
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, row) => 
        {
            return (<Link href={`serials/${row.imdbid}`}>
                <Button style={{borderColor: "#ff00ff"}}>
                    PREVIEW
                </Button>
            </Link>)
        }
    }
]