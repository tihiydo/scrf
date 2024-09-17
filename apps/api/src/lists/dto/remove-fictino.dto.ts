import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const RemoveFictionDtoSchema = z.object({
  serial: z.string().optional(),
  movie: z.string().optional(),
});

export class RemoveFictionDto extends createZodDto(RemoveFictionDtoSchema) {}
