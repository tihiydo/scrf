'use client'

import { useQuery } from '@tanstack/react-query'
import styles from './subscription-history.module.scss'
import { GetSubscriptionHistory } from '@/api/requests/subscription/history'
import { apiClient } from '@/app/api/client'
import { Subscriptions } from '@/entities/user'
import { format } from 'date-fns'
import { SubscriptionHistoryItem } from '@/entities/subscription/history'

type Props = {
    history: SubscriptionHistoryItem[]
}

const SubscriptionHistory = ({ history }: Props) => {
    return (
        <table
            className={styles.table}
            align="left"
            cellSpacing={0}
        >
            <thead>
                <tr>
                    <th align="left">plan</th>
                    <th align="left">date</th>
                    <th align="left">price</th>
                </tr>
            </thead>
            <tbody>
                {history.map(historyItem => (
                    <tr>
                        <td>{Subscriptions[historyItem.type]}</td>
                        <td>{format(new Date(historyItem.createdAt), 'dd/MM/yyyy')}</td>
                        <td>{historyItem.price}$</td>
                    </tr>
                ))}
            </tbody>
        </table >

    )
}

export default SubscriptionHistory