'use client';

import classNames from 'classnames';
import styles from './new-password-form.module.scss';
import { z } from 'zod';
import { Alert, Button, Form, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { AxiosInternalApiError } from '@/types';
import { apiClient } from '@/app/api/client';

type FormFields = {
  password: string;
  passwordRepeat: string;
}

type Props = {
  token: string;
  className?: string;
  onSubmit?: (values: FormFields) => void;
}

const RegistrationForm = ({ className, onSubmit, token }: Props) => {


  const router = useRouter();
  const resetPasswordMutation = useMutation({
    mutationFn: (data: FormFields) => {
      return apiClient.post(`/auth/reset-password/${token}`, {
        password: data.password,
        passwordRepeat: data.passwordRepeat
      })
    },
    onError: (_: AxiosInternalApiError) => { },
    onSuccess: () => {
      router.push('/password-changed')
    }
  })

  const isLoading = resetPasswordMutation.isPending;
  const errorMessage = resetPasswordMutation.error?.response?.data.message;

  return (
    <Form<FormFields>
      requiredMark={false}
      onFinish={async (values) => {
        try {
          resetPasswordMutation.mutateAsync(values);
          onSubmit?.(values)
        } catch (error) { }
      }}
      layout='vertical'
      autoComplete='off'
      className={classNames(styles.form, className)}

    >
      {
        errorMessage ? (
          <Alert className={styles.formErrorAlert} message={errorMessage} closable showIcon type='error' />
        ) : null
      }

      <Form.Item<FormFields>
        validateTrigger="onBlur"
        label={<label htmlFor='email' className={styles.formLabel}>password</label>}
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
        <Input.Password disabled={isLoading} size='large' placeholder="New password" />
      </Form.Item>

      <Form.Item<FormFields>
        validateTrigger="onBlur"
        label={<label htmlFor='password' className={styles.formLabel}>Repeat the password</label>}
        name="passwordRepeat"

        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password disabled={isLoading} size='large' type='password' placeholder="Repeat the password" />
      </Form.Item>

      <Form.Item noStyle>
        <Button loading={isLoading} className={styles.formSubmitBtn} size='large' type="primary" htmlType="submit">
          Confirm
        </Button>
      </Form.Item>
    </Form >
  )
}

export default RegistrationForm