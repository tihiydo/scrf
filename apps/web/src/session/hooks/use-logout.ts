import { ACCESS_TOKEN_KEY } from "@/constants/jwt";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "./use-session";
import { apiClient } from "@/app/api/client";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

type Args = {
    onSuccess?: () => void;
}
export const useLogout = (options?: Args) => {
    const session = useSession();
    const router = useRouter()

    return useMutation({
        mutationFn: () => {
            return apiClient.get('/auth/logout', {
                withCredentials: true
            });
        },
        onSuccess: () => {
            deleteCookie(ACCESS_TOKEN_KEY)
            session.user = null;
            session.status = 'unauthentificated';

            options?.onSuccess?.();
            router.refresh()
        },
        onError: (error) => {
        }
    });
}