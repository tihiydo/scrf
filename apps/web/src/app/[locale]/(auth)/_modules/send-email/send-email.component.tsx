'use client';

import { LoadingOutlined, MailOutlined } from '@ant-design/icons'
import styles from './send-email.module.scss'
import { useTimer } from 'react-timer-hook';
import { formatTime } from '@/utils/time';
import classNames from 'classnames';
import { Alert } from 'antd';

type Props = {
    onResendClick: (restart: (newTimestamp: Date) => void) => void;
    onChangeEmailClick: () => void;
    availableAt: Date;
    isResending?: boolean;
    error?: string;
}

const SendEmail = ({ onChangeEmailClick, onResendClick, availableAt, isResending, error }: Props) => {
    const { seconds, minutes, isRunning, restart } = useTimer({ expiryTimestamp: availableAt, })

    return (
        <div className={styles.sendEmail}>
            <MailOutlined className={styles.sendEmailIcon} />

            <h3 className={styles.sendEmailTitle}>
                a confirmation letter has been sent to <span>your email</span>
            </h3>

            {error ? (
                <Alert type='error' closable showIcon message={error} className={styles.sendEmailErrorAlert} />
            ) : null}

            <div className={styles.sendEmailActionsList}>
                <p className={styles.sendEmailQuestion}>Didn't receive the letter?</p>
                <button
                    disabled={isRunning}
                    onClick={() => {
                        onResendClick(
                            (date) => restart(date, true)
                        );
                    }}
                    className={classNames(styles.sendEmailAction, styles.sendEmailResend, (isRunning || isResending) ? styles.sendEmailResendDisabled : null)}
                >
                    {isResending
                        ? <LoadingOutlined />
                        : isRunning
                            ? formatTime({ minutes, seconds })
                            : 'Receive a second email'
                    }

                </button>
                <p className={styles.sendEmailQuestion}>Wrong mail? </p>
                <button onClick={onChangeEmailClick} type='button' className={styles.sendEmailAction}>Change mail</button>
            </div>
        </div>
    )
}

export default SendEmail