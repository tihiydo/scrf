'use client';
import classNames from 'classnames';
import styles from './registration-form.module.scss';
import { z } from 'zod';
import { Alert, Button, Form, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { getWindow } from '@/utils/client';
import { ACCESS_TOKEN_KEY } from '@/constants/jwt';
import { useSession } from '@/session/hooks/use-session';
import { AxiosInternalApiError } from '@/types';
import { env } from '@/env';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';
import { setCookie } from 'cookies-next';
import { apiClient } from '@/app/api/client';
import { RegisterRequest } from '@/api/requests/auth';

type FormFields = {
    email: string;
    password: string;
    captcha: string;
}


type Props = {
    className?: string;
    onSubmit?: (values: FormFields) => void;
}

const RegistrationForm = ({ className, onSubmit }: Props) => {
    const window = getWindow();
    const [form] = Form.useForm<FormFields>();
    const [recaptchaToken, setRecaptchaToken] = useState<Maybe<string>>(null);
    const session = useSession();

    const registerMutation = useMutation({
        mutationKey: RegisterRequest.mutationKeys,
        mutationFn: (values: FormFields) => {
            return apiClient.post<RegisterRequest.ResponseData>(RegisterRequest.url, {
                email: values.email,
                password: values.password
            } satisfies RegisterRequest.RequestBody)
        },
        onSuccess: (response) => {
            setCookie(ACCESS_TOKEN_KEY, response.data.accessToken)
            session.user = response.data.user;
            session.status = 'authentificated';
        },
        onError: (_: AxiosInternalApiError) => { }
    })
    const errorMessage = registerMutation.error?.response?.data.message;

    return (
        <Form<FormFields>
            form={form}
            onFinish={async (values) => {
                try {
                    const resp = await registerMutation.mutateAsync(values)

                    onSubmit?.(values);
                } catch (error) {

                }
            }}
            layout='vertical'
            className={classNames(styles.registrationForm, className)}

        >
            {errorMessage ? (
                <Alert showIcon closable className={styles.registrationFormAlert} type='error' message={errorMessage} />
            ) : (
                null
            )}

            <Form.Item<FormFields>
                validateTrigger="onBlur"
                label={<label htmlFor='email' className={styles.registrationFormLabel}>Email</label>}
                name="email"
                rules={[
                    {
                        validator(_, value) {
                            const { success } = z.string().email().safeParse(value);
                            if (success) return Promise.resolve();

                            return Promise.reject('Enter valid email')
                        },
                    }
                ]}
            >
                <Input autoComplete='' disabled={registerMutation.isPending} size='large' placeholder="Your email" />
            </Form.Item>

            <Form.Item<FormFields>
                validateTrigger="onBlur"
                label={<label htmlFor='password' className={styles.registrationFormLabel}>Password</label>}
                name="password"
                rules={[
                    {
                        validator(_, value) {
                            const { success, error } = z
                                .string()
                                .min(1)
                                .safeParse(value);

                            if (success) return Promise.resolve();
                            return Promise.reject(error.errors[0]?.message)
                        },
                    }
                ]}
            >
                <Input.Password disabled={registerMutation.isPending} size='large' type='password' placeholder="Enter your password" />
            </Form.Item>

            <Form.Item<FormFields>
                name={'captcha'}
            >
                <ReCAPTCHA
                    sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                        setRecaptchaToken(token)
                    }}
                />
            </Form.Item>

            <Form.Item noStyle>
                <Button disabled={!recaptchaToken} loading={registerMutation.isPending} className={styles.registrationFormSubmitBtn} size='large' type="primary" htmlType="submit">
                    Next
                </Button>
            </Form.Item>
        </Form >
    )
}

export default RegistrationForm