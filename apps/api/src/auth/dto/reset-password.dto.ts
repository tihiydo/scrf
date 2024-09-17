import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ResetPasswordDtoSchema = z
  .object({
    password: z.password(),
    passwordRepeat: z.password(),
  })
  .refine((data) => {
    return data.password === data.passwordRepeat;
  }, 'Passwords dont match');

export class ResetPasswordDto extends createZodDto(ResetPasswordDtoSchema) {}
