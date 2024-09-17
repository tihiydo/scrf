
import { UserRole } from "@/entities/user";
import { sessionStore } from "@/session/session.store";
import { RouteAccess } from "@/types";
import { observer } from "mobx-react-lite";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function isAuth(Component: any, options: {
    access: RouteAccess,
    redirectUrl?: string;
} = {
        access: 'protected',
        redirectUrl: '/'
    }) {
    // const ObservedComponent = observer(Component);


    function IsAuth(props: any) {
        const userRole = sessionStore.user?.role;
        const isSessionLoading = !sessionStore.isInitialized;

        const isRoleValid = typeof userRole === 'string' && Object.values(UserRole).some(role => userRole === role);
        let shouldPass = false;

        if (isRoleValid) {
            if (options.access instanceof Array) {
                shouldPass = options.access.includes(userRole)
            }

            if (options.access === 'protected') {
                shouldPass = true
            }
        } else {
            if (options.access === '*') {
                shouldPass = true
            }
        }



        useEffect(() => {
            if (!shouldPass && !isSessionLoading) {
                return redirect(options.redirectUrl ?? '/');
            }
        }, []);


        if (!shouldPass) {
            return null;
        }

        return <Component {...props} />;
    };

    return observer(IsAuth)
}