"use client"

import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { columns } from './columns.component'
import { DownloadData, DownloadDataTable } from '@/types/downloads'
import { formatDate } from '@/utils/time'
import { getStatus } from '@/utils/status'
import { apiClient } from '@/app/api/client'

type Props = 
{
    status: "DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | "All" | undefined
}

const DownloadsTable = ({status} : Props) => 
{
    const [data, setData] = useState<DownloadDataTable[]>()
    const filteredData = () =>
    {
        console.error(status)
        if(status !== undefined && status !== "All")
        {
            return data?.filter((el) => el.status == status)
        }
        else
        {
            return data
        }
    }
    console.error(data)

    const updateData = async () =>
    {
        const response = await apiClient<DownloadData[]>(`/downloads`)
        const filteredResponse = response.data.filter(el => el.downloadIsComplete != true)
        const responseToTable = filteredResponse.map((el) => 
        {
           
            return {
                imdbid: el.imdbid,
                title: el.title,
                status: getStatus(el),
                fileSize: (parseInt(el.downloadFileSize) / 1073741824).toFixed(2) + "Gb",
                downloadStartAt: formatDate(new Date(el.downloadStartAt)),
                downloaded: (parseInt(el.downloadedFileSize) / parseInt(el.downloadFileSize) * 100).toFixed(2) + "%",
                downloadFinishedAt: el.downloadFinishedAt == null ? "" : formatDate(new Date(el.downloadFinishedAt)),
                fragmentationStartedAt: el.fragmentationStartedAt == null ? "" : formatDate(new Date(el.fragmentationStartedAt)),
                fragmentationFinishedAt: el.fragmentationFinishedAt == null ? "" : formatDate(new Date(el.fragmentationFinishedAt)),
                fragmentationError: el.fragmentationError

            }
        })
        setData(responseToTable)
    }

    useEffect(() =>
    {
        updateData()
        const interval = setInterval(async () =>
        {
            await updateData()
        }, 10000)
        
        return () =>
        {
            clearInterval(interval)
        }
    }, [])

    return (
        <Table
            columns={columns}
            dataSource={filteredData()}
        />
    )
}

export default DownloadsTable