"use client";

import { observer } from "mobx-react-lite";
import styles from "./page.module.scss";
import { ProfileForm } from "./_components/profile-form";
import { BreadCrumbs } from "@/components/ui/bread-crumbs";
import classNames from "classnames";

type FormFields = {
  userName: string;
};

function ProfilePage() {
  return (
    <div className={styles.profile}>
      <h3 className={styles.title}>profile</h3>

      <ProfileForm />
    </div>
  );
};


export default observer(ProfilePage) 