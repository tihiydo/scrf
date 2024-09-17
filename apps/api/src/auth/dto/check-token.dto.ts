import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { AuthTokenScope } from '../entities/auth-token.entity';

export const CheckTokenDtoSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  scope: z.nativeEnum(AuthTokenScope),
});

export class CheckTokenDto extends createZodDto(CheckTokenDtoSchema) {}
