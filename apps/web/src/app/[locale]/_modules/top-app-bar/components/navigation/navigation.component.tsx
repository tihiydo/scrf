'use client'

import { Link, usePathname } from '@/i18n/navigation'
import styles from './navigation.module.scss'
import classNames from 'classnames';
import { MyList } from '@/components/my-list';
import Dropdown from './components/dropdown';
import { useEffect, useState } from 'react';
import { useSession } from '@/session/hooks/use-session';
import { observer } from 'mobx-react-lite';

type Props = {
    className?: string;
}

const TopAppBarNavigation = ({
    className
}: Props) => {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const session = useSession();
    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth < 1600;
            setIsMobile(isMobileView);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <nav className={classNames(className, styles.navigation,)}>
            <ul className={styles.navigationList}>
                <li className={''}>
                    <Link
                        className={classNames(
                            styles.navigationLink,
                            pathname === '/categories/films' && styles.navigationLinkActive
                        )}
                        href={'/categories/films'}
                    >
                        Films
                    </Link>
                </li>

                <li>
                    <Link
                        className={classNames(
                            styles.navigationLink,
                            pathname === '/categories/serials' && styles.navigationLinkActive
                        )}
                        href={'/categories/serials'}
                    >
                        Serials
                    </Link>
                </li>

                <li>
                    <Link
                        className={classNames(
                            styles.navigationLink,
                            pathname.startsWith('/sport') && styles.navigationLinkActive
                        )}
                        href={'/sport'}
                    >
                        SPORT
                    </Link>
                </li>
                {session.status === 'authentificated' ? (
                    <li>
                        <MyList
                            className={classNames(
                                styles.navigationLink,
                                pathname.startsWith('/lists') && styles.navigationLinkActive
                            )}
                        />
                    </li>
                ) : null}

                {
                    isMobile ? (
                        <Dropdown />
                    ) : (
                        <>
                            <li>
                                <Link
                                    className={classNames(
                                        styles.navigationLink,
                                        pathname.startsWith('/collections') && styles.navigationLinkActive
                                    )}
                                    href={'/collections'}
                                >
                                    collections
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={classNames(
                                        styles.navigationLink,
                                        pathname.startsWith('/plans') && styles.navigationLinkActive
                                    )}
                                    href={'/plans'}
                                >
                                    plans
                                </Link>
                            </li>
                        </>
                    )
                }
            </ul>
        </nav>
    )
}

export default observer(TopAppBarNavigation)