'use client'

import { apiClient } from '@/app/api/client';
import { Button } from '@/components/ui/button';
import { ACCESS_TOKEN_KEY } from '@/constants/jwt';
import { useRouter } from '@/i18n/navigation';
import { useSession } from '@/session/hooks/use-session';
import { useMutation } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { deleteCookie } from 'cookies-next';
import { observer } from 'mobx-react-lite';
import styles from './delecte-account.module.scss'
import { useState } from 'react';
import { useLocalStorage, useMediaQuery } from '@uidotdev/usehooks';
import { Drawer } from 'vaul';
import classNames from 'classnames';
import { X } from 'lucide-react';

type Props = {}

const DeleteAccount = (props: Props) => {
    const session = useSession();
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [isDrawerOpened, setDrawerOpened] = useState(false);

    const deleteAccountMutation = useMutation({
        mutationFn: () => {
            window.localStorage.removeItem("email-auth-session");
            
            return apiClient.delete(`/users/me`);
        },
        onSuccess: () => {
            console.log(window.localStorage.getItem("email-auth-session")); // Перевірка перед видаленням
            window.localStorage.removeItem("email-auth-session");
            console.log(window.localStorage.getItem("email-auth-session")); // Перевірка після видалення
            message.info('Account deleted')
            deleteCookie(ACCESS_TOKEN_KEY)
            session.user = null;
            session.status = "unauthentificated";
            router.push("/register");
        },
        onError: () => {
            message.error('Account can\'t be deleted')
        }

    });

    const isLarge = useMediaQuery('screen and (min-width: 768px')

    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.title}>delete account</h4>
                <p
                    className={styles.description}
                >
                    Are you sure you want to delete your account? If deleted, it will be
                    impossible to restore it
                </p>
                <Button
                    className={styles.btn}
                    variant="pimary"
                    onClick={() => {
                        setModalOpen(true)
                        setDrawerOpened(!isDrawerOpened)

                    }}
                    disabled={deleteAccountMutation.isPending}
                >
                    delete
                </Button>
            </div>

            {
                isLarge ? (
                    <Modal
                        centered
                        title={<h4 className={styles.modalTitle}>Account deletion</h4>}
                        open={modalOpen}
                        onCancel={() => {
                            if (deleteAccountMutation.isPending) return;
                            setModalOpen(false)
                        }}
                        footer={<div className={styles.modalFooter}>
                            <Button
                                style={{ background: 'red' }}
                                variant={'pimary'}
                                onClick={() => deleteAccountMutation.mutate()}
                                disabled={deleteAccountMutation.isPending}
                                isLoading={deleteAccountMutation.isPending}

                            >
                                Delete
                            </Button>

                            <Button
                                variant={'accent-outline'}
                                disabled={deleteAccountMutation.isPending}
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>}
                    >
                        <p className={styles.modalContent}>Deleting your account is a permanent action and cannot be undone. You will lose all your data</p>
                    </Modal>
                ) : (
                    <Drawer.Root open={isDrawerOpened} onOpenChange={setDrawerOpened}>
                        <Drawer.Portal>
                            <Drawer.Overlay className={styles.mobileOverlay} />
                            <Drawer.Content className={classNames(styles.filtersMobile, styles.mobile)}>
                                <Drawer.Handle />
                                <div className={styles.filtersMobileDrawerContent}>
                                    <div>
                                        <div className={styles.filtersMobileHeader}>
                                            <h4 className={styles.filtersMobileTitle}>DELETE ACCOUNT</h4>
                                            <Drawer.Close>
                                                <Button className={styles.filtersMobileClose} >
                                                    <X />
                                                </Button>
                                            </Drawer.Close>
                                        </div>
                                    </div>
                                    <div className={styles.filtersMobileContent}>
                                        <div className={styles.filterItem}>
                                            <p
                                                className={styles.description}
                                            >
                                                Are you sure you want to delete your account? If deleted, it will be
                                                impossible to restore it
                                            </p>
                                            <div className={styles.modalFooter}>
                                                <Button
                                                    style={{ background: 'red' }}
                                                    variant={'pimary'}
                                                    onClick={() => deleteAccountMutation.mutate()}
                                                    disabled={deleteAccountMutation.isPending}
                                                    isLoading={deleteAccountMutation.isPending}

                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    variant={'accent-outline'}
                                                    disabled={deleteAccountMutation.isPending}
                                                    onClick={() => setDrawerOpened(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root >
                )
            }

        </>
    )
}


export default observer(DeleteAccount)