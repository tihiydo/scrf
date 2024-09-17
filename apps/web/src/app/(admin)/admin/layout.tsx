import { AdminNavbar } from './modules/navbar';
import styles from './layout.module.scss'
import { getServerUser } from '@/session/api';
import { redirect } from 'next/navigation';
import { Header } from './modules/header';
import { AdminRole } from '@/entities/user';

type Props = {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const user = await getServerUser();

  if (!user || Object.values(AdminRole).every(role => role !== user.role)) {
    redirect('/admin-login')
  }

  return (
    <div className={styles.layout}>
      <AdminNavbar />

      <div className={styles.layoutContent}>
        <Header />
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout