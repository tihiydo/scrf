import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
