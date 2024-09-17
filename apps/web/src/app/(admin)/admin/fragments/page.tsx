"use client"

import React, { useState } from 'react'
import { FragmentsFilters } from './components/filters'
import FragmentsTable from './components/table/table.component'

type Props = {}

const AdminFragmentsPage = (props: Props) => 
{
const [status, setStatus] = useState<"DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | undefined | "All" >()
  return (
    <div>
      <FragmentsFilters setStatus={setStatus} status={status}/>
      <FragmentsTable status={status}/>
    </div>
  )
}

export default AdminFragmentsPage