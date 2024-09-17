'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './navbar-link.module.scss'
import classNames from 'classnames';
import { AdminRoute } from '../../routes';

type Props = AdminRoute;

const AdminNavbarLink = ({ displayValue, pathname }: Props) => {
    const adminPathname = '/admin' + pathname;

    const activePage = usePathname();
    return (
        <Link
            href={adminPathname}
            className={classNames(
                styles.link,
                { [styles.linkActive]: adminPathname === activePage }
            )}
        >
            {displayValue}
        </Link>
    )
}

export default AdminNavbarLink