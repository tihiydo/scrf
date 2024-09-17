import React from 'react'
import { Footer } from '../_modules/footer';
import styles from './layout.module.scss'
import TopAppBar from '../_modules/top-app-bar/top-app-bar.component';
import TextLogo from '@/components/ui/text-logo/text-logo.component';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import PageTransitionEffect from '@/components/utils/page-transition/page-transition-effect';
import { MobileSearch } from '@/modules/mobile-search';

type Props = {
    children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
    return (
        <div className={styles.wrapper}>
            <TopAppBar />

            <main className={styles.content}>
                {children}
            </main>

            <Footer className={styles.footer} />
            <TextLogo text='SCREENIFY' />
            <BottomNavBar className={styles.bottomBar} />
            <MobileSearch />
            <div className={styles.overlay} />
        </div>
    )
}

export default PublicLayout