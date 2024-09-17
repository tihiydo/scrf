"use client";

import { observer } from "mobx-react-lite";
import classNames from "classnames";
import styles from "./bottom-nav-bar.module.scss";
import { HomeIcon, ListIcon, LogInIcon, SearchIcon, UserIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SessionStatus, sessionStore } from "@/session/session.store";
import { globalSearchStore } from "@/stores/global-search-store";
import { LoadingIcon } from "../icons/loading-icon";

type Props = {
    className?: string;
};

const BottomNavBar = observer(({ className }: Props) => {
    const pathname = usePathname();

    const accountIcon: Record<SessionStatus, React.ReactNode> = {
        authentificated: <UserIcon className={styles.navItemLinkIcon} />,
        idle: <LogInIcon className={styles.navItemLinkIcon} />,
        loading: <LoadingIcon className={styles.navItemLinkIcon} />,
        unauthentificated: <LogInIcon className={styles.navItemLinkIcon} />
    }

    return (
        <div className={classNames(className, styles.barContainer)}>
            <div className={classNames(styles.bar)}>
                <nav className={classNames(styles.fls, 'container')}>
                    <ul className={styles.navList}>
                        <li className={classNames(
                            styles.navItem,
                            pathname === '/' && styles.navItemActive,
                        )}>
                            <Link className={styles.navItemLink} href="/">
                                <HomeIcon className={styles.navItemLinkIcon} />
                                <p className={styles.navItemText}>Home</p>
                            </Link>
                        </li>

                        <li className={classNames(styles.navItem)}>
                            <button
                                className={styles.navItemLink}
                                onClick={() => globalSearchStore.toggleOpen()}
                            >
                                <SearchIcon className={styles.navItemLinkIcon} />
                                <p className={styles.navItemText}>Search</p>
                            </button>
                        </li>

                        {sessionStore.status === 'authentificated' ? (
                            <li className={classNames(styles.navItem)}>
                                <Link
                                    className={styles.navItemLink}
                                    href={'/lists'}
                                >
                                    <ListIcon className={styles.navItemLinkIcon} />
                                    <p className={styles.navItemText}>My Lists</p>
                                </Link>
                            </li>
                        ) : null}

                        <li className={classNames(
                            styles.navItem,
                            pathname === '/account' && styles.navItemActive,
                        )}>
                            <Link
                                className={styles.navItemLink}
                                href={sessionStore.user ? "/account" : "/login"}
                            >
                                {accountIcon[sessionStore.status]}
                                <p className={styles.navItemText}>{sessionStore.status === 'authentificated' ? "Account" : sessionStore.status === 'unauthentificated' ? "Log In" : 'Loading'}</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
});

export default BottomNavBar;
