'use client'

import { useLogout } from '@/session/hooks/use-logout';
import styles from './header.module.scss';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from '@/session/hooks/use-session';
import { UserRole } from '@/entities/user';
import { Cagliostro } from 'next/font/google';
import { observer } from 'mobx-react-lite';
type Props = {}

const UserRoleName: Record<UserRole, string> = {
    "content-manager": 'Content Manager',
    "review-manager": "Review Manager",
    "sales-team": "Sales Team",
    Admin: 'Admin',
    User: "User"
}

const Header = (props: Props) => {
    const sessionStore = useSession()
    const router = useRouter();
    const logoutMutation = useLogout({
        onSuccess: () => {
            router.push('/')
        }
    });
    console.log(sessionStore.user?.role)
    const roleName = sessionStore.user?.role ? UserRoleName[sessionStore.user?.role] : null;



    return (
        <div className={styles.header}>
            <h3 className={styles.title}>
                Screenify <span className={styles.titleHighlight}>Admin Panel</span>
            </h3>

            <div className={styles.right}>
                {roleName ? (
                    <p className={styles.roleName}>{roleName}</p>
                ) : null}

                <Button
                    className={styles.logoutBtn}
                    variant='pimary'
                    isLoading={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate()}
                >

                    Logout
                </Button>
            </div>
        </div>
    )
}

export default observer(Header)