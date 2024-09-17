"use client";

import classNames from "classnames";
import { z } from "zod";
import { Alert, Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { AxiosInternalApiError } from "@/types";
import styles from "./forgot-password-form.module.scss";
import { apiClient } from "@/app/api/client";

type FormFields = {
  email: string;
};

type Props = {
  className?: string;
  onSubmit: (data: FormFields) => void;
  isChangePasswordRoute?: boolean;
};

const ForgotPasswordForm = ({
  className,
  onSubmit,
  isChangePasswordRoute,
}: Props) => {
  const requestResetPasswordMutation = useMutation({
    mutationFn: (data: FormFields) => {
      return apiClient.post("/auth/request-reset-password", {
        email: data.email,
        isChange: isChangePasswordRoute,
        valueType: "long"
      });
    },
    onError: (_: AxiosInternalApiError) => {},
  });

  const isLoading = requestResetPasswordMutation.isPending;
  const errorMessage =
    requestResetPasswordMutation.error?.response?.data.message;

  return (
    <Form<FormFields>
      onFinish={async (values) => {
        try {
          await requestResetPasswordMutation.mutateAsync({
            email: values.email,
          });
          onSubmit?.(values);
        } catch (error) {}
      }}
      layout="vertical"
      autoComplete="off"
      className={classNames(styles.form, className)}
    >
      {errorMessage ? (
        <Alert
          closable
          showIcon
          className={styles.formErrorAlert}
          message={errorMessage}
          type="error"
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
              const { success } = z.string().email().safeParse(value);
              if (success) return Promise.resolve();

              return Promise.reject("Enter valid email");
            },
          },
        ]}
      >
        <Input disabled={isLoading} size="large" placeholder="Your email" />
      </Form.Item>

      <Form.Item noStyle>
        <Button
          loading={isLoading}
          className={styles.formSubmitBtn}
          size="large"
          type="primary"
          htmlType="submit"
        >
          send an email
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPasswordForm;
