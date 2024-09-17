import { z } from 'nestjs-zod/z';
import { UserRole } from 'src/user/entities/user.entity';

export const JWTPayloadSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(UserRole),
});
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
