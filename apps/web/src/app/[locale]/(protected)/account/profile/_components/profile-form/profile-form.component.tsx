//@ts-nocheck
'use client'

import { apiClient } from '@/app/api/client';
import { Button } from '@/components/ui/button';
import { useResize } from '@/hooks/use-resize';
import { AxiosInternalApiError } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Alert, Avatar, Form, Input, Upload, message } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { RcFile } from 'antd/es/upload';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import styles from './profile-form.module.scss';
import { z } from 'zod';
import { sessionStore } from '@/session/session.store';
import { uploadSingleFile } from '@/app/api/upload/single';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';

type Props = {}

type FormFields = {
    userName: string;
};

const ProfileForm = (props: Props) => {
    const [form] = Form.useForm();
    const [imgData, setImageData] = useState<{
        file: RcFile | File | null;
        temporaryPath: string | null;
    }>({
        file: null,
        temporaryPath: null,
    });



    const { screenWidth } = useResize();

    const handleUploadFile = async (file: RcFile | File) => {
        const isPNG = file.type === "image/png";
        if (!isPNG) {
            message.error(`${file.name} is not a png file`);
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImageData({ file: file, temporaryPath: reader.result as string });
        };
    };


    const getFilePath = async () => {
        if (!imgData.file) return;
        try {
            const resp = await uploadSingleFile({
                collection: "avatar",
                file: imgData.file,
                allowedExts: ["png", "pdf"],
                path: ["raz", "dva", "tri"],
            });
            return resp.data.url;
        } catch (error: any) {
            const axiosError = error as AxiosInternalApiError;
        }
    };

    const updateFormMutation = useMutation({
        mutationFn: async (data: FormFields) => {
            const avatarUrl = await getFilePath();
            return apiClient.patch(`/users/update-user/${sessionStore.user?.id}`, {
                avatarUrl: avatarUrl,
                userName: data.userName,
            });
        },
        onError: (_: AxiosInternalApiError) => { },
        onSuccess: () => {
            sessionStore.loadUser();
            message.success('Profile updated')
        },
    });

    useEffect(() => {
        if (sessionStore.user && sessionStore.user.userName) {
            form.setFieldsValue({
                userName:
                    sessionStore.user.userName ?? sessionStore.user?.email?.split("@")[0],
            });
        }
    }, [sessionStore.user]);

    const errorMessage = updateFormMutation.error?.response?.data.message;
    const rule = createSchemaFieldRule(
        z.object({
            userName: z.string().min(1, "Required").max(20),
        })
    );

    return (
        <WrapperBlock className={styles.profile__content}>
            <div className={styles.profile__imageUploader}>
                <Avatar
                    className={styles.avatar}
                    size={screenWidth > 425 ? 130 : 70}
                    src={
                        imgData.temporaryPath
                            ? imgData.temporaryPath
                            : sessionStore.user?.avatarUrl
                    }
                >
                    {(!imgData.temporaryPath || !sessionStore.user?.avatarUrl) && "A"}
                </Avatar>
                <Upload
                    beforeUpload={(file) => {
                        handleUploadFile(file);
                        return false;
                    }}
                    multiple={false}
                    showUploadList={false}
                >
                    <Button
                        variant="accent-outline"
                        className={styles.profile__imageUploader__button}
                    >
                        EDIT PHOTO
                    </Button>
                </Upload>
            </div>
            <Form<FormFields>
                form={form}
                onFinish={async (values: FormFields) => {
                    try {
                        updateFormMutation.mutateAsync(values);
                    } catch (error) { }
                }}
                layout="vertical"
                autoComplete="off"
                className={styles.profile__form}
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
                    className={styles.profile__form__item}
                    label={
                        <label htmlFor="userName" className={styles.profile__form__label}>
                            profile name
                        </label>
                    }
                    name="userName"
                    rules={[rule]}
                >
                    <Input size="large" placeholder="Your name" />
                </Form.Item>

                <Form.Item noStyle>
                    <Button
                        className={classNames(styles.profile__form__button, {
                            [`${styles.profile__form__button_disabled}`]:
                                updateFormMutation.isPending,
                        })}
                        variant="pimary"
                        type="submit"
                        disabled={updateFormMutation.isPending}
                    >
                        save
                    </Button>
                </Form.Item>
            </Form>
        </WrapperBlock>)
}

export default observer(ProfileForm)