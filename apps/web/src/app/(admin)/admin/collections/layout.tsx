'use client'

import isAuth from '@/hoc/is-auth';
import { adminRoutes } from '../modules/navbar/routes';

type Props = {
    children: React.ReactNode;
}


const CollectionsLayout = ({ children }: Props) => {
    return children;
}

export default isAuth(CollectionsLayout, {
    access: adminRoutes.collections.access,
    redirectUrl: '/admin'
})