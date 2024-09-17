import classNames from 'classnames'
import TopAppBarNavigation from './components/navigation/navigation.component'
import styles from './top-app-bar.module.scss'
import { Search } from './components/search';
import { Account } from './components/account';
import { Subscription } from './components/subscription';
import { Link } from '@/i18n/navigation';
import { env } from '@/env';



const TopAppBar = () => {
    return (
        <header className={styles.header}>
            <div className={classNames('container', styles.headerContainer)}>
                <div style={{ position: "relative" }}>
                    <Link href="/" className={styles.logo}>
                        SCREENIFY
                    </Link>
                    {
                        env.NEXT_PUBLIC_ENVIROMENT == "dev" &&
                        <div id="message" style={{ color: "#fcff00", marginTop: "-12px", right: "0px", fontWeight: "bolder", position: "absolute" }}>
                            DEVELOPMENT
                        </div>
                    }
                </div>
                
                <TopAppBarNavigation className={styles.navigation} />


                <div className={styles.actionsMobile}>
                    <Subscription />
                </div>

                <div className={styles.actionsDesktop}>
                    <Subscription />

                    <div className={styles.actionsDesktopIcons}>
                        <Search className={styles.actionsDesktopSearch} />

                        <Account className={styles.actionsDesktopAccount} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default TopAppBar