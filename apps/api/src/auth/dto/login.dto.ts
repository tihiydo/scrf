import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { AuthTokenValueType } from '../entities/auth-token.entity';

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.password(),
  verification: z
    .object({
      tokenType: z.nativeEnum(AuthTokenValueType).optional(),
    })
    .optional(),
});

export class LoginDto extends createZodDto(LoginRequestBodySchema) {}
