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
    },
    {
        title: 'Download finished',
        dataIndex: 'downloadFinishedAt',
        key: 'downloadFinishedAt',
        render: (downloadFinishedAt) => {
            return downloadFinishedAt;
        }
    },
    {
        title: 'Fragmentation started',
        dataIndex: 'fragmentationStartedAt',
        key: 'fragmentationStartedAt',
        render: (fragmentationStartedAt) => {
            return fragmentationStartedAt;
        }
    },
    {
        title: 'Fragmentation finished',
        dataIndex: 'fragmentationFinishedAt',
        key: 'fragmentationFinishedAt',
        render: (fragmentationFinishedAt) => 
        {
            return fragmentationFinishedAt;
        }
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, row) => 
        {
            return (
            row.status == "Converted" || row.status == "DECLINED"
            ?
                <Link href={`fragments/${row.imdbid}`}>
                    <Button style={{borderColor: "#ff00ff"}}>
                        PREVIEW
                    </Button>
                </Link>
                
            :
            <>
                <Button style={{cursor: "default", borderColor: "red"}}>
                    NOT ALLOWED
                </Button>
            </>
            )
        }
    }
]