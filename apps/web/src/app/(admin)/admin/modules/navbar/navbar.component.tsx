'use client'

import classNames from 'classnames';
import styles from './navbar.module.scss';
import { adminRoutes, isAdminRouteDisabled } from './routes';
import AdminNavbarLink from './components/navbar-link/navbar-link.component';
import React from 'react';
import { useSession } from '@/session/hooks/use-session';
import { observer } from 'mobx-react-lite';

type Props = {
  className?: string
}

const AdminNavbar = ({ className }: Props) => {
  const { user } = useSession()

  return (
    <nav className={classNames(styles.navbar, className)}>
      <ul className={styles.navbarList}>
        {Object.values(adminRoutes).map((route, index, routes) => (
          !user?.role || isAdminRouteDisabled(route, user.role) ? (
            null
          ) : (
            <React.Fragment key={route.pathname}>
              <AdminNavbarLink  {...route} />
              {index !== routes.length - 1 ? (
                <div className={styles.navbarSeparator} />
              ) : null}
            </React.Fragment>
          )
        ))}
      </ul>
    </nav>
  )
}

export default observer(AdminNavbar)