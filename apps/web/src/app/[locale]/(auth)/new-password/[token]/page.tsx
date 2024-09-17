import { NewPasswordForm } from './_components/new-password-form'
import styles from './page.module.scss'


type Props = {
  params: { token: string }
}

const NewPassword = ({ params: { token }}: Props) => {
  return (
    <div className={styles.page}>
        <h1 className={styles.pageTitle}>new password</h1>

        <NewPasswordForm token={token} />
    </div>
  )
}

export default NewPassword