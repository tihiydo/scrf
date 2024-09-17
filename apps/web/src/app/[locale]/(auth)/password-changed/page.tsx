import { CheckSquareOutlined } from '@ant-design/icons'
import styles from './page.module.scss'
import { Button } from 'antd'
import { Link } from '@/i18n/navigation'


const VerificationPage = () => {
    return (
        <div className={styles.page}>
            <CheckSquareOutlined className={styles.pageIcon} />
            <h1 className={styles.pageTitle}>
                password changed
            </h1>

            <Link href={'/login'} className={styles.pageButtonLink}>
                <Button size='large' type='primary' className={styles.pageButton}>
                    sign in
                </Button>
            </Link>
        </div>
    )
}

export default VerificationPage