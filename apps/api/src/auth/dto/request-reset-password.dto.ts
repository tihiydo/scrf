import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { AuthTokenValueType } from '../entities/auth-token.entity';

export const RequestResetPasswordDtoSchema = z.object({
  email: z.string().email(),
  isChange: z.boolean().optional(),
  valueType: z.nativeEnum(AuthTokenValueType),
});

export class RequestResetPasswordDto extends createZodDto(
  RequestResetPasswordDtoSchema,
) {}
