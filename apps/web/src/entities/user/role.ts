export const UserRole = {
    User: 'User',
    Admin: 'Admin',
} as const;
export type UserRole = ObjectValues<typeof UserRole>;
