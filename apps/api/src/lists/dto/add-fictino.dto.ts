import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddFictionDtoSchema = z.object({
  serial: z.string().optional(),
  movie: z.string().optional(),
});

export class AddFictionDto extends createZodDto(AddFictionDtoSchema) {}
