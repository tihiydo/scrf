import { ChangePasswordForm } from "./_components";
import styles from "./page.module.scss";

type Props = {
  params: { token: string };
};

const ChangePassword = ({ params: { token } }: Props) => {
  return (
    <div className={styles.changePassword}>
      <h3 className={styles.changePassword__title}>Settings</h3>

      <div className={styles.changePassword__content}>
        <div className={styles.changePassword__header}>
          <h4>Change password</h4>
        </div>
        <ChangePasswordForm token={token} />
      </div>
    </div>
  );
};

export default ChangePassword;
