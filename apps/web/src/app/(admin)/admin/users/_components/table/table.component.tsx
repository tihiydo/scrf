"use client"

import { Table } from 'antd'
import { columns } from './columns.component'
import { User } from '@/entities/user'

type Props = {
    users: User[]
}

const UsersTable = ({ users }: Props) => {
    return (
        <Table
            columns={columns}
            dataSource={users}
        />
    )
}

export default UsersTable