'use client'

import isAuth from '@/hoc/is-auth';
import { adminRoutes } from '../modules/navbar/routes';

type Props = {
    children: React.ReactNode;
}


const MoviesNoLayout = ({ children }: Props) => {
    return children;
}

export default isAuth(MoviesNoLayout, {
    access: adminRoutes.moviesNo.access,
    redirectUrl: '/admin'
})