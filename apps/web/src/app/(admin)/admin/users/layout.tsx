'use client'

import isAuth from '@/hoc/is-auth';
import { adminRoutes } from '../modules/navbar/routes';

type Props = {
    children: React.ReactNode;
}


const MoviesLayout = ({ children }: Props) => {
    return children;
}

export default isAuth(MoviesLayout, {
    access: adminRoutes.users.access,
    redirectUrl: '/admin'
})