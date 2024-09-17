"use client"

import React, { useState } from 'react'
import { DownloadsFilters } from './components/filters'
import DownloadsTable from './components/table/table.component'

type Props = {}

const AdminDownloadsPage = (props: Props) => 
{
const [status, setStatus] = useState<"DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | undefined | "All" >()
  return (
    <div>
      <DownloadsFilters setStatus={setStatus} status={status}/>
      <DownloadsTable status={status}/>
    </div>
  )
}

export default AdminDownloadsPage