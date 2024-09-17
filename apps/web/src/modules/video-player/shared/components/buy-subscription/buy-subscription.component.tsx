import React from 'react'
import styles from './buy-subscription.module.scss';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { isNativeMobileAppUser } from '../../utils';
import { getWindow } from '@/utils/client';

type Props = {}

const BuySubscription = (props: Props) => {
  const window = getWindow();
  const isAppUser = isNativeMobileAppUser(window?.navigator?.userAgent ?? '')


  return (
    <div className={styles.bg}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1>Buy subscription to watch full movie</h1>
          {isAppUser ? (
            <Button onClick={() => {
              // @ts-expect-error
              window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SUBSCRIPTION_BUTTON_PRESSED' }));
            }}
              variant={"accent-outline"}>
              BUY NOW
            </Button>
          ) : (
            <Link href="/register"><Button variant={"accent-outline"}>BUY NOW</Button></Link>

          )}
        </div>
      </div>
    </div>
  )
}

export default BuySubscription