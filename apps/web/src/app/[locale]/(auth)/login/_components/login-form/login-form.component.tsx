"use client";
import classNames from "classnames";
import styles from "./login-form.module.scss";
import { z } from "zod";
import { Alert, Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { ACCESS_TOKEN_KEY } from "@/constants/jwt";
import { useSession } from "@/session/hooks/use-session";
import { getWindow } from "@/utils/client";
import { AxiosInternalApiError } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { apiClient } from "@/app/api/client";
import { setCookie } from 'cookies-next';
import { LoginRequest } from "@/api/requests/auth";

type FormFields = {
  email: string;
  password: string;
};

type Props = {
  className?: string;
};

const LoginForm = ({ className }: Props) => {
  const router = useRouter();
  const window = getWindow();
  const session = useSession();
  const loginMutation = useMutation({
    mutationKey: LoginRequest.mutationKeys,
    mutationFn: (values: FormFields) => {
      return apiClient.post<LoginRequest.ResponseData>(
        LoginRequest.url,
        {
          email: values.email,
          password: values.password,
        } satisfies LoginRequest.RequestBody,
        LoginRequest.config
      );
    },
    onSuccess: (response) => {
      setCookie(ACCESS_TOKEN_KEY, response.data.accessToken)
      const nextAuthRoute = window?.localStorage.getItem("nextAuthRoute");

      session.loadUser();
      router.push(nextAuthRoute ?? "/account");
    },
    onError: (_: AxiosInternalApiError) => { },
  });
  const errorMessage = loginMutation.error?.response?.data.message;

  return (
    <Form<FormFields>
      onFinish={async (values) => {
        loginMutation.mutate(values);
      }}
      layout="vertical"
      autoComplete="off"
      className={classNames(styles.form, className)}
    >
      {errorMessage ? (
        <Alert
          showIcon
          closable
          className={styles.formAlert}
          type="error"
          message={errorMessage}
        />
      ) : null}

      <Form.Item<FormFields>
        validateTrigger="onBlur"
        label={
          <label htmlFor="email" className={styles.formLabel}>
            Email
          </label>
        }
        name="email"
        rules={[
          {
            validator(_, value) {
              const { success, error } = z.string().email().safeParse(value);
              if (success) return Promise.resolve();

              return Promise.reject("Enter valid email");
            },
          },
        ]}
      >
        <Input
          disabled={loginMutation.isPending}
          size="large"
          placeholder="Your email"
        />
      </Form.Item>

      <Form.Item<FormFields>
        validateTrigger="onBlur"
        label={
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
        }
        name="password"
        rules={[
          {
            validator(_, value) {
              const { success, error } = z.string().safeParse(value);

              if (success) return Promise.resolve();
              return Promise.reject(error.errors[0]?.message);
            },
          },
        ]}
      >
        <Input.Password
          disabled={loginMutation.isPending}
          size="large"
          type="password"
          placeholder="Enter your password"
        />
      </Form.Item>

      <Form.Item noStyle>
        <Button
          loading={loginMutation.isPending}
          className={styles.formSubmitBtn}
          size="large"
          type="primary"
          htmlType="submit"
        >
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
