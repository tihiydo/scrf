"use client"

import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { columns } from './columns.component'
import { DownloadData, DownloadDataTable, MoviesData } from '@/types/downloads'
import { formatDate } from '@/utils/time'
import { apiClient } from '@/app/api/client'
import { Movie } from '@/entities/movie'
import { tableEntity } from '@/entities/table-entity'
import SearchComponent from '../search'

type Props = {}

const MoviesTable = (props: Props) => {
    const [data, setData] = useState<tableEntity[]>([])
    const [filteredData, setFilteredData] = useState<tableEntity[]>([])

    const updateData = async () => {
        const response = await apiClient<tableEntity[]>(`/movies/not-checked`)
        setData(response.data.filter((el) => {
            return el.fiction?.checked == false; 
        }).sort((a, b) =>
        {
            return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        }))
    }

 
    useEffect(() => {
        updateData()
    }, [])

    return (
        <div>
            <SearchComponent data={data} setData={setFilteredData}/>
            <Table
                columns={columns}
                dataSource={filteredData}
            />
        </div>
    )
}

export default MoviesTable