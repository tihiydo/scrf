'use client';

import { Link, usePathname } from '@/i18n/navigation';
import styles from './nav-tabs.module.scss';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

type Props = {
    className?: string;
};

const NavTabs = ({ className }: Props) => {
    const listRef = useRef<HTMLUListElement | null>(null);
    const pathname = usePathname();
    const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (listRef.current && activeLinkRef.current) {
            const listElement = listRef.current;
            const activeElement = activeLinkRef.current;


            // Calculate the distance from the start of the list to the active element
            const activeElementRect = activeElement.getBoundingClientRect();
            const listRect = listElement.getBoundingClientRect();

            const activeElementX = activeElementRect.left - listRect.left;

            // Calculate the scroll position to center the active element
            const scrollPosition =
                activeElementX +
                activeElementRect.width / 2 - // Half of the active element's width
                listElement.clientWidth / 2 // Half of the list's width
            // Add help block width to the calculation

            // Scroll the list to the calculated position
            listElement.scrollLeft = scrollPosition;
        }
    }, [pathname]);

    return (
        <nav className={classNames(styles.nav, 'container', className)}>
            <ul ref={listRef} className={classNames(styles.list, 'no-scrollbar')}>
                <li className={styles.item}>
                    <Link
                        ref={pathname === '/' ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname === '/' && styles.itemActive)}
                        href={'/'}
                    >
                        Main
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        ref={pathname === '/categories/films' ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname === '/categories/films' && styles.itemActive)}
                        href={'/categories/films'}
                    >
                        Movies
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        ref={pathname === '/categories/serials' ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname === '/categories/serials' && styles.itemActive)}
                        href={'/categories/serials'}
                    >
                        Serials
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        ref={pathname === '/sport' ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname === '/sport' && styles.itemActive)}
                        href={'/sport'}
                    >
                        Sports
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        ref={pathname.startsWith('/collections') ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname.startsWith('/collections') && styles.itemActive)}
                        href={'/collections'}
                    >
                        Collections
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        ref={pathname.startsWith('/plans') ? activeLinkRef : null}
                        className={classNames(styles.itemLink, pathname.startsWith('/plans') && styles.itemActive)}
                        href={'/plans'}
                    >
                        Plans
                    </Link>
                </li>

                <li
                    style={{
                        minWidth: listRef.current ? listRef.current.clientWidth / 2 : '50%',
                        height: 1,
                        visibility: 'hidden',
                    }}
                ></li>
            </ul>
        </nav>
    );
};

export default observer(NavTabs);
