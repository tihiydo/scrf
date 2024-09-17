'use client';

import isAuth from "@/hoc/is-auth";
import { adminRoutes } from "../modules/navbar/routes";

type Props = {
  children: React.ReactNode

}

const SerialsLayout = ({ children }: Props) => {
  return children
}

export default isAuth(SerialsLayout, {
  access: adminRoutes.serials.access,
  redirectUrl: '/admin'
})