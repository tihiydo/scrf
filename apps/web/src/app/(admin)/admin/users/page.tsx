'use client'

import { ADMIN_KEYS } from '@/constants/query-keys'
import { User } from '@/entities/user'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import UsersTable from './_components/table/table.component'
import { apiClient } from '@/app/api/client'

type Props = {}

const AdminUsersPage = (props: Props) => {
    const usersQuery = useQuery({
        queryKey: [ADMIN_KEYS.GET_USERS],
        queryFn: async () => {
            const response = await apiClient.get<User[]>('/users/moderation')
            return response.data;
        }
    })

    return (
        <div>
            {usersQuery.data ? (
                <UsersTable users={usersQuery.data} />
            ) : (
                null
            )}
        </div>
    )
}

export default AdminUsersPage