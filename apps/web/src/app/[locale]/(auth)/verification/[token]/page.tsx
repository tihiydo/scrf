'use client';

import { CheckSquareOutlined, ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from './page.module.scss'
import { Alert, Button } from 'antd'
import { Link } from '@/i18n/navigation'
import { useMutation, MutationStatus } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { AxiosInternalApiError } from '@/types';
import classNames from 'classnames';
import { apiClient } from '@/app/api/client';
import { VerificationRequest } from '@/api/requests/auth';

const statusTitles: Record<MutationStatus, React.ReactNode> = {
    error: 'account cant be verified',
    idle: 'verifyiing account',
    pending: 'verifyiing account',
    success: 'account is verified',
}

const statusIcons: Record<MutationStatus, React.ReactNode> = {
    error: <ExclamationCircleOutlined className={classNames(styles.pageIcon, styles.pageIconError)} />,
    idle: <LoadingOutlined className={classNames(styles.pageIcon, styles.pageIconPending)} />,
    pending: <LoadingOutlined className={classNames(styles.pageIcon, styles.pageIconPending)} />,
    success: <CheckSquareOutlined className={styles.pageIcon} />,
}

type Props = {
    params: { token: string }
}

const VerificationPage = ({ params: { token } }: Props) => {
    const verificationMutation = useMutation({
        mutationFn: () => {
            return apiClient.post<VerificationRequest.ResponseData>(
                VerificationRequest.url(token)
            )
        },
        mutationKey: VerificationRequest.mutationKeys(token),
        onError: (_: AxiosInternalApiError) => { }
    });

    useEffect(() => {
        verificationMutation.mutate();
    }, [])




    const errorMessage = verificationMutation.error?.response?.data.message;

    return (
        <div className={styles.page}>
            {statusIcons[verificationMutation.status] ?? statusIcons.pending}
            <h1 className={styles.pageTitle}>
                {statusTitles[verificationMutation.status] ?? statusTitles.pending}
            </h1>

            {errorMessage ? <Alert className={styles.pageErrorAlert} message={errorMessage} type='error' style={{ width: "100%" }} /> : null}

            <Link href={'/login'} className={styles.pageButtonLink}>
                <Button size='large' type='primary' className={styles.pageButton}>
                    sign in
                </Button>
            </Link>
        </div>
    )
}

export default VerificationPage