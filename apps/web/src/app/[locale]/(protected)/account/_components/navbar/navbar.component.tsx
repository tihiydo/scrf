import { sessionStore } from '@/session/session.store'
import { Avatar } from 'antd'
import { observer } from 'mobx-react-lite'
import styles from './navbar.module.scss';
import { useResize } from '@/hooks/use-resize';
import { ProfileIcon, SettingsIcon, SubscriptionIcon } from '@/components/icons';
import { Link, useRouter } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { LogOutIcon } from 'lucide-react';
import { useLogout } from '@/session/hooks/use-logout';
import router from 'next/router';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';


const SIDEBAR_ITEMS = [
    {
        icon: <ProfileIcon />,
        title: "profile",
        href: "/account/profile",
    },
    {
        icon: <SubscriptionIcon />,
        title: "subscription",
        href: "/account/subscription",
    },
    {
        icon: <SettingsIcon />,
        title: "settings",
        href: "/account/settings",
    },
];


type Props = {}

const Navbar = (props: Props) => {
    const { screenWidth } = useResize();
    const pathname = usePathname();
    const router = useRouter();


    const logout = useLogout({
        onSuccess: () => {
            router.push('/');
        }
    });


    return (
        <div className={styles.sidebar}>
            <WrapperBlock className={styles.user}>
                <Avatar
                    className={styles.avatar}
                    size={screenWidth <= 600 ? 70 : 90}
                    src={sessionStore.user?.avatarUrl}
                >
                    {!sessionStore.user?.avatarUrl && "A"}
                </Avatar>
                <div className={styles.userData}>
                    <h3>
                        {sessionStore.user?.userName ??
                            sessionStore.user?.email?.split("@")[0]}
                    </h3>
                    <p>{sessionStore.user?.email}</p>
                </div>
                <div className={styles.itemButton}>
                    <button
                        className={styles.isPending}
                        disabled={logout.isPending}
                        onClick={() => {
                            logout.mutate()
                        }}
                    >
                        <LogOutIcon className={styles.itemIcon} />
                    </button>
                </div>
            </WrapperBlock>
            <WrapperBlock className={styles.tabs}>
                {SIDEBAR_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        className={classNames(styles.tab, {
                            [`${styles.tabActive}`]:
                                pathname.includes(item.href),
                        })}
                        href={item.href}
                    >
                        {item.icon}
                        <p> {item.title}</p>
                    </Link>
                ))
                }
            </WrapperBlock >

        </div >
    )
}

export default observer(Navbar)