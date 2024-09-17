'use client';

import { ArrowLeftOutlined } from '@ant-design/icons'
import styles from './return-btn.module.scss';
import classNames from 'classnames';
import { useRouter } from '@/i18n/navigation';

type Props = {
    className?: string;
}

const ReturnBtn = ({ className }: Props) => {
    const router = useRouter();
    return (
        <button
            role='link'
            onClick={router.back}
            className={classNames(styles.returnBtn, className)}
        >
            <ArrowLeftOutlined className={styles.returnBtnIcon} />
            Return
        </button>
    )
}

export default ReturnBtn