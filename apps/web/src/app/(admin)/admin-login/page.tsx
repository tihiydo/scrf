'use client'
import { Alert, Button, Divider, Form, Input } from 'antd';
import styles from './page.module.scss';
import React from 'react'
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useSession } from '@/session/hooks/use-session';
import { getWindow } from '@/utils/client';
import { ACCESS_TOKEN_KEY } from '@/constants/jwt';
import { AxiosInternalApiError } from '@/types';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { apiClient } from '@/app/api/client';

type FormFields = {
    email: string;
    password: string;
}


type Props = {}

const AdminLoginPage = () => {
    const router = useRouter();
    const window = getWindow();
    const session = useSession();
    const loginMutation = useMutation({
        mutationFn: (values: FormFields) => {
            return apiClient.post('/auth/admin-login', {
                email: values.email,
                password: values.password
            }, {
                withCredentials: true
            })
        },
        onSuccess: (response) => {
            setCookie(ACCESS_TOKEN_KEY, response.data.accessToken)
            session.loadUser();
            router.push('/admin')
        },
        onError: (_: AxiosInternalApiError) => { }

    })
    const errorMessage = loginMutation.error?.response?.data.message;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h1 className={styles.contentTitle}>Adminpanel Login</h1>

                <Divider style={{
                    marginTop: '10px',
                    marginBottom: '20px'
                }} />

                {errorMessage ? (
                    <Alert showIcon closable className={styles.formAlert} type='error' message={errorMessage} />
                ) : (
                    null
                )}

                <Form<FormFields>
                    layout='vertical'
                    autoComplete='off'
                    onFinish={async (values) => {
                        loginMutation.mutate(values)
                    }}
                >
                    <Form.Item<FormFields>
                        label={<label htmlFor='email' className={styles.formLabel}>Email</label>}
                        validateTrigger="onBlur"
                        name={'email'}
                        rules={[
                            {
                                validator(_, value) {
                                    const { success, error } = z.string().email().safeParse(value);
                                    if (success) return Promise.resolve();

                                    return Promise.reject('Enter valid email')
                                },
                            }
                        ]}
                    >
                        <Input disabled={loginMutation.isPending} size='large' placeholder='Enter email' />
                    </Form.Item>

                    <Form.Item<FormFields>
                        label={<label htmlFor='password' className={styles.formLabel}>Password</label>}
                        validateTrigger="onBlur"
                        name={'password'}
                        rules={[
                            {
                                validator(_, value) {
                                    const { success, error } = z.string().min(1).safeParse(value);

                                    if (success) return Promise.resolve();
                                    return Promise.reject(error.errors[0]?.message)
                                },
                            }
                        ]}
                    >
                        <Input disabled={loginMutation.isPending} type='password' size='large' placeholder='Enter password' />
                    </Form.Item>

                    <Form.Item<FormFields>
                        noStyle
                        name={'password'}
                    >
                        <Button loading={loginMutation.isPending} type='primary' size='large' htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form >
            </div >
        </div >
    )
}

export default AdminLoginPage