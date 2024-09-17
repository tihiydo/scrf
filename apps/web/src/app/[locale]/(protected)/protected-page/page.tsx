'use client'
import { useSession } from '@/session/hooks/use-session'
import { observer } from 'mobx-react-lite'
import React from 'react'

type Props = {}

const ProtectedPage = (props: Props) => {
    const session = useSession();
    
    return (
        <div>
            <p>{session.status}</p>
            
            {session.user?.email}
        </div>
    )
}

export default observer(ProtectedPage)