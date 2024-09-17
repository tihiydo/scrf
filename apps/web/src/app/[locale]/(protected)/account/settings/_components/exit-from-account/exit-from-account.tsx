'use client'

import { apiClient } from '@/app/api/client';
import { Button } from '@/components/ui/button';
import { ACCESS_TOKEN_KEY } from '@/constants/jwt';
import { useRouter } from '@/i18n/navigation';
import { useSession } from '@/session/hooks/use-session';
import { useMutation } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { deleteCookie } from 'cookies-next';
import { observer } from 'mobx-react-lite';
import styles from './delecte-account.module.scss'
import { useState } from 'react';
import { useLogout } from '@/session/hooks/use-logout';

type Props = {}

const ExitFromAccount = (props: Props) => 
{
    const session = useSession();
    const {mutateAsync: logout} = useLogout();

    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.title}>Exit from account</h4>
                <p
                    className={styles.description}
                >
                    Are you sure you want leave from session? 
                </p>
                <Button
                    variant="accent-outline"
                    onClick={async () => {
                        await logout()
                    }}
                >
                    Log Out
                </Button>
            </div>
        </>
    )
}


export default observer(ExitFromAccount)