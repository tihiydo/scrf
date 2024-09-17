"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/session/hooks/use-session";
import { useRouter } from "@/i18n/navigation";

import styles from "./page.module.scss";
import { DeleteAccount } from "./_components/delete-account";
import ExitFromAccount from "./_components/exit-from-account/exit-from-account";
import { observer } from "mobx-react-lite";
import { AdminRole } from "@/entities/user";
import { DeviceSection } from "./_components/devices-section";
import { BreadCrumbs } from "@/components/ui/bread-crumbs";
import classNames from "classnames";

const SettingsPage = () => {
  const router = useRouter();
  const session = useSession();

  console.log('session', session.user?.role)
  return (
    <div className={styles.settings}>
      <h3 className={styles.settings__title}>settings</h3>
      <div className={styles.settings__content}>
        <div className={styles.settings__action}>
          <h4>change of password</h4>
          <p>
            You can send a reset password link to your account email:
            {" "}
            {session.user?.email}
          </p>
          <Button
            className={styles.settings__action__changeButton}
            variant="pimary"
            onClick={() => {
              router.push("/change-password");
            }}
          >
            Change
          </Button>
        </div>

        {!session.isInitialized || Object.values(AdminRole).some(r => r === session.user?.role) ? (
          null
        ) : (
          <DeleteAccount />
        )}

        {/* <ExitFromAccount/> */}

        {/* <DeviceSection /> */}
      </div>
    </div>
  );
};


export default observer(SettingsPage)