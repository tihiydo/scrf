'use client';

import isAuth from "@/hoc/is-auth";
import { adminRoutes } from "../modules/navbar/routes";

type Props = {
  children: React.ReactNode
}

const SerialsNoLayout = ({ children }: Props) => {
  return children
}

export default isAuth(SerialsNoLayout, {
  access: adminRoutes.serialsNo.access,
  redirectUrl: '/admin'
})