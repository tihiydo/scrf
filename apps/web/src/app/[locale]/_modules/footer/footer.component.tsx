'use client'

import classNames from 'classnames'
import styles from './footer.module.scss'
import { Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import TextLogo from '@/components/ui/text-logo/text-logo.component'
import { Link } from '@/i18n/navigation'
import { MyList } from '@/components/my-list'
import { useSession } from '@/session/hooks/use-session'
import { observer } from 'mobx-react-lite'

type Props = {
  className?: string;
}

const Footer = ({ className }: Props) => {
  const session = useSession();

  return (
    <footer className={classNames(styles.footer, className)}>
      <div>

        <div className={classNames('container', styles.footerContent)}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>
              Navigation
            </h4>

            <ul>
              <li className={styles.navSectionItem}>
                <Link className={styles.navSectionItemContent} href="/categories/films">Films</Link>
              </li>

              <li className={styles.navSectionItem}>
                <Link className={styles.navSectionItemContent} href="/categories/serials">Serials</Link>
              </li>

              {session.status === 'authentificated' ? (
                <li className={styles.navSectionItem}>
                  <MyList position='top-left' className={styles.navSectionItemContent} />
                </li>
              ) : null}
            </ul>
          </div>
          <div className={classNames(styles.footerSection, styles.contactSection)}>
            <h4 className={styles.footerSectionTitle}>
              Contact
            </h4>

            <div>
              <p className={styles.contactSectionItem}>
                LOREMIPSUM@GMAIL.COM
              </p>

              <Link href={'/privacy-policy'} className={styles.contactSectionItem}>
                TERMS AND CONDITION
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default observer(Footer)