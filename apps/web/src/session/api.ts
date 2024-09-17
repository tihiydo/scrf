import { User } from "@/entities/user";
import { apiServer } from "@/app/api/server";
import { headers } from 'next/headers';

export async function getServerUser(): Promise<Maybe<User>> {
    try {
        const getApi = apiServer(headers)
        const response = await getApi.get<User>(`/users/me`)

        if (!response.data.id) {
            return null
        }
        return response.data
    }
    catch (error) {
        return null;
    }
}
