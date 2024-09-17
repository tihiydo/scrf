'use client'

import isAuth from '@/hoc/is-auth';
import { adminRoutes } from '../modules/navbar/routes';

type Props = {
    children: React.ReactNode;
}


const ReviewsLayout = ({ children }: Props) => {
    return children;
}

export default isAuth(ReviewsLayout, {
    access: adminRoutes.reviews.access,
    redirectUrl: '/admin'
})