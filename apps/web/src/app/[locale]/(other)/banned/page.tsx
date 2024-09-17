'use client'

import { useRouter } from '@/i18n/navigation'
import { useLogout } from '@/session/hooks/use-logout'
import { Button } from 'antd'
import styles from './page.module.scss';
import { StopOutlined } from '@ant-design/icons';
import { LogOutIcon } from 'lucide-react';

type Props = {}

const BannedPage = (props: Props) => {




    const router = useRouter();
    const logoutMutation = useLogout({
        onSuccess: () => {
            router.push('/')
        }
    });


    return (
        <div className={styles.page}>
            <StopOutlined className={styles.icon} />

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Account Banned
                </h1>
                <p className={styles.text}>
                    Unfortunately, your account has been banned by the administrator. This action has been taken in accordance with our community guidelines or terms of service. If you believe this is a mistake or would like to appeal the decision, please contact our support team. Thank you for your understanding.
                </p>
                <Button
                    size='large'
                    className={styles.logoutBtn}
                    type='primary'
                    // loading={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate()}

                >
                    LOG OUT
                </Button>
            </div>
        </div>
    )
}

export default BannedPage