'use client'

import React from 'react'
import styles from './page.module.scss';
import { RegistrationForm } from './_components/registration-form';
import { Link } from '@/i18n/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { z } from 'zod';
import { SendEmail, useEmailAuthSession } from '../_modules/send-email';
import { useMutation } from '@tanstack/react-query';
import { AxiosInternalApiError } from '@/types';
import { apiClient } from '@/app/api/client';

const resendInterval = 1000 * 60;


const RegisterPage = () => {
  const requestVerifTokenMutation = useMutation({
    mutationFn: (email: string) => {
      return apiClient.post('/auth/request-verif-token', {
        email: email,
      })
    },
    onError: (_: AxiosInternalApiError) => { }
  });
  const isResending = requestVerifTokenMutation.isPending;

  const { removeStorageState, storageState, setStorageState } = useEmailAuthSession({
    type: 'registration'
  });


  return (
    <div className={styles.register}>
      {!storageState || storageState.expires < Date.now() ? (
        <>
          <h1 className={styles.registerTitle}>Registration</h1>

          <RegistrationForm
            onSubmit={(values) => {
              setStorageState({
                expires: Date.now() + 1000 * 60 * 10,
                email: values.email,
                allowedAt: Date.now() + resendInterval
              })
            }}
          />

          <div className={styles.login}>
            <p className={styles.loginText}>Do you have an account?</p>

            <Link className={styles.loginLink} href={'/login'}>
              Sign in
            </Link>
          </div>
        </>
      ) : (
        <SendEmail
          error={requestVerifTokenMutation.error?.response?.data.message}
          isResending={isResending}
          availableAt={new Date(storageState.allowedAt)}
          onResendClick={async (restart) => {
            const allowed = storageState.allowedAt < Date.now()

            if (allowed) {
              try {
                await requestVerifTokenMutation.mutateAsync(storageState.email);
                const nextAllowedAt = Date.now() + resendInterval;
                setStorageState({
                  expires: Date.now() + 1000 * 60 * 10,
                  allowedAt: nextAllowedAt,
                })
                restart(new Date(nextAllowedAt))
              } catch (error) { }
            }
          }}
          onChangeEmailClick={() => {
            removeStorageState()
          }}
        />
      )}


    </div>
  )
}

export default RegisterPage