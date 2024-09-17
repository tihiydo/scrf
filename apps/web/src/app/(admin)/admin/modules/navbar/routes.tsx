import { AdminRole, UserRole } from "@/entities/user";
import { RouteAccess } from "@/types";

export type AdminRoute = {
    pathname: `/${string}`
    displayValue: React.ReactNode;
    access: RouteAccess
}

type RouteKeyword = 'collections' | 'movies' | 'moviesNo' | 'serials' | 'serialsNo' | 'users' | 'topSection' | 'reviews'
export const adminRoutes: Record<RouteKeyword, AdminRoute> = {
    movies: {
        pathname: '/movies',
        displayValue: 'Checked Movies',
        access: [UserRole.Admin]
    },
    moviesNo: {
        pathname: '/movies-no',
        displayValue: 'Movies',
        access: [UserRole.Admin, UserRole.ContentManager]
    },
    serials: {
        pathname: '/serials',
        displayValue: 'Checked Serial',
        access: [UserRole.Admin]
    },
    serialsNo: {
        pathname: '/serials-no',
        displayValue: 'Serials',
        access: [UserRole.Admin, UserRole.ContentManager]
    },
    collections: {
        pathname: '/collections',
        displayValue: 'Collections',
        access: [UserRole.Admin, UserRole.ContentManager]
    },
    users: {
        pathname: '/users',
        displayValue: 'Users',
        access: [UserRole.Admin, UserRole.SalesTeam]
    },
    topSection: {
        pathname: '/top-section',
        displayValue: 'Top Section',
        access: [UserRole.Admin, UserRole.ContentManager]
    } as const,
    reviews: {
        pathname: '/reviews',
        displayValue: 'Reviews',
        access: [UserRole.Admin, UserRole.ContentManager, UserRole.ReviewManager]
    }
} as const;


export function isAdminRouteDisabled(route: RouteKeyword | AdminRoute, userRole: string) {
    const routeObj = typeof route === 'string'
        ? adminRoutes[route]
        : route


    if (routeObj.access instanceof Array) {
        return !routeObj.access.includes(userRole)
    }

    if (routeObj.access === '*') return true;

    if (routeObj.access === 'protected') return Object.values(AdminRole).some(role => role === userRole)
}