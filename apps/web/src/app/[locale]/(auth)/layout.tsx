import React from 'react'
import styles from './layout.module.scss'
import authBg from '@/assets/images/auth-background.png';
import GoBackLink from '@/components/go-back-link/go-back-link.component';
import classNames from 'classnames';
import { Footer } from '../_modules/footer';
import TopAppBar from '../_modules/top-app-bar/top-app-bar.component';
import TextLogo from '@/components/ui/text-logo/text-logo.component';
import { HeroBackground, ImageBackground } from '@/components/ui/hero-background';
import { BottomNavBar } from '@/components/bottom-nav-bar';

type Props = {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className={styles.wrapper}>
      <ImageBackground src={authBg} alt='Background' />

      <TopAppBar />

      <main className={styles.content}>
        <div className={classNames('container', styles.goBack)}>
          <GoBackLink className={styles.goBackLink} />
        </div>


        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>

      <Footer className={styles.footer} />
      <TextLogo className={styles.textLogo} />
      <BottomNavBar className={styles.bottomBar} />
    </div>
  )
}

export default AuthLayout