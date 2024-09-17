'use client'

import { Button } from '@/components/ui/button'
import { LogInIcon, LogOutIcon, UserCircleIcon } from 'lucide-react'
import styles from './account.module.scss'
import { useSession } from '@/session/hooks/use-session'
import { observer } from 'mobx-react-lite'
import { LoadingIcon } from '@/components/icons/loading-icon'
import { useState } from 'react'
import { useClickAway } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useRouter } from '@/i18n/navigation'
import { useLogout } from '@/session/hooks/use-logout'
import classNames from 'classnames'
import { DropdownItem, DropdownMenu, DropdownRoot, DropdownTrigger } from '@/components/ui/dropdown'

type Props = {
    className?: string;
}

const Account = observer(({ className }: Props) => {
    const { status } = useSession();
    const router = useRouter();
    const logout = useLogout({
        onSuccess: () => {
            router.push('/');
        }
    });

    const [isOpened, setIsOpened] = useState(false);
    const ref = useClickAway<HTMLDivElement>((e) => {
        setIsOpened(false)
    });



    return (
        <div className={styles.container} ref={ref}>


            <DropdownRoot position='bottom-right'>
                <DropdownTrigger>
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className={classNames(styles.btn, className)}
                        onClick={() => {
                            if (status === 'authentificated' || status === 'unauthentificated') {
                                setIsOpened(!isOpened)
                            }
                        }}
                    >
                        {status === 'unauthentificated' ? (
                            <UserCircleIcon className={styles.icon} />
                        ) : (
                            null)
                        }

                        {status === 'authentificated' ? (
                            <UserCircleIcon className={styles.icon} />
                        ) : (
                            null
                        )}

                        {status === 'loading' ? (
                            <LoadingIcon />
                        ) : (
                            null
                        )}
                    </Button>
                </DropdownTrigger>

                <DropdownMenu>
                    {status === 'authentificated' ? (
                        <>
                            <DropdownItem className={styles.item}>
                                <Link
                                    href={'/account'}
                                    className={styles.itemBtn}
                                >
                                    <UserCircleIcon className={styles.itemIcon} />
                                    <p className={styles.itemText}>Account</p>
                                </Link>
                            </DropdownItem>


                            <DropdownItem className={styles.item}>
                                <button
                                    className={styles.itemBtn}
                                    disabled={logout.isPending}
                                    onClick={() => {
                                        logout.mutate()
                                    }}
                                >
                                    <LogOutIcon className={styles.itemIcon} />
                                    <p className={styles.itemText}>Sign out</p>
                                </button>
                            </DropdownItem>
                        </>
                    ) : null}

                    {status === 'unauthentificated' ? (
                        <>
                            <DropdownItem className={styles.item}>
                                <Link href={'/login'} className={styles.itemBtn}>
                                    <LogInIcon className={styles.itemIcon} />
                                    <p className={styles.itemText}>Log in</p>
                                </Link>
                            </DropdownItem>
                        </>
                    ) : null}

                </DropdownMenu>
            </DropdownRoot>
        </div >
    )
})

export default Account