import { Link } from '@/i18n/navigation';
import LoginForm from './_components/login-form/login-form.component'
import styles from './page.module.scss';

type Props = {}

const LoginPage = (props: Props) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>sign in</h1>

      <LoginForm />

      <Link href={'/forgot-password'} className={styles.forgotPasswordLink}>
        Forgot your password?
      </Link>
      <div className={styles.register}>
        <p className={styles.registerText}>Still not registered?</p>

        <Link className={styles.registerLink} href={'/register'}>
          Register
        </Link>
      </div>
    </div>
  )
}

export default LoginPage