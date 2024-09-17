'use client';

import isAuth from "@/hoc/is-auth";
import { adminRoutes } from "../modules/navbar/routes";

type Props = {
  children: React.ReactNode
}

const TopSectionLayout = ({ children }: Props) => {
  return children
}

export default isAuth(TopSectionLayout, {
  access: adminRoutes.topSection.access,
  redirectUrl: '/admin'
})