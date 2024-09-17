"use client";

import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import { ForgotPasswordForm } from "./_components/forgot-password-form";
import { ReturnBtn } from "./_components/return-btn";
import { usePathname } from "@/i18n/navigation";
import { AxiosInternalApiError } from "@/types";
import { SendEmail, useEmailAuthSession } from "../_modules/send-email";

import styles from "./page.module.scss";
import { apiClient } from "@/app/api/client";

type Props = {};

const ForgotPasswordPage = (props: Props) => {
  const pathname = usePathname();

  const isChangePasswordRoute = useMemo(
    () => pathname.includes("change-password"),
    [pathname]
  );

  const requestResetPasswordMutation = useMutation({
    mutationFn: (email: string) => {
      return apiClient.post("/auth/request-reset-password", {
        email: email,
        isChange: isChangePasswordRoute,
        valueType: "long"
      });
    },
    onError: (_: AxiosInternalApiError) => {},
  });

  const { removeStorageState, storageState, setStorageState } =
    useEmailAuthSession({
      type: "forgot-password",
    });

  return (
    <div className={styles.page}>
      {!storageState || storageState.expires < Date.now() ? (
        <>
          <h1 className={styles.pageTitle}>
            {isChangePasswordRoute
              ? "Change password?"
              : "Forgot your password?"}
          </h1>

          <ForgotPasswordForm
            isChangePasswordRoute={isChangePasswordRoute}
            onSubmit={(values) => {
              setStorageState({
                expires: Date.now() + 1000 * 60 * 10,
                email: values.email,
                allowedAt: Date.now() + 1000 * 60,
              });
            }}
          />
          <ReturnBtn className={styles.pageReturnLink} />
        </>
      ) : (
        <SendEmail
          isResending={requestResetPasswordMutation.isPending}
          error={requestResetPasswordMutation.error?.response?.data.message}
          availableAt={new Date(storageState.allowedAt)}
          onResendClick={async (restart) => {
            const allowed = storageState.allowedAt < Date.now();

            if (allowed) {
              try {
                await requestResetPasswordMutation.mutateAsync(
                  storageState.email
                );
                const nextAvailable = Date.now() + 1000 * 60;
                setStorageState({
                  allowedAt: nextAvailable,
                  expires: Date.now() + 1000 * 60 * 10,
                });
                restart(new Date(nextAvailable));
              } catch (error) {}
            }
          }}
          onChangeEmailClick={() => {
            removeStorageState();
          }}
        />
      )}
    </div>
  );
};

export default ForgotPasswordPage;
