'use client'

import { DownloadDataTable } from '@/types/downloads';
import { formatDate } from '@/utils/time';
import { Button, type TableColumnsType } from 'antd';
import Link from 'next/link';

export const columns: TableColumnsType<DownloadDataTable> = [
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
        dataIndex: 'title',
        key: 'title',
        render: (title) => {
            return title;
        }
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status) => {
            return <Button style={{borderColor: "#0fff00", cursor: "default"}}>{status}</Button>
        }
    },
    {
        title: 'Size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        render: (fileSize) => {
            return fileSize;
        }
    },
    {
        title: 'Download start',
        dataIndex: 'downloadStartAt',
        key: 'downloadStartAt',
        render: (downloadStartAt) => {
            return downloadStartAt;
        }
    },
    {
        title: 'Download progress',
        dataIndex: 'downloaded',
        key: 'downloaded',
        render: (downloaded) => {
            return downloaded == "100.00%" ? "Finished" : downloaded;
        }
    }
]