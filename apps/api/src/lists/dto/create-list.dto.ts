import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateListDtoSchema = z.object({
  name: z.string(),
  serials: z.array(z.string()).optional(),
  movies: z.array(z.string()).optional(),
});

export class CreateListDto extends createZodDto(CreateListDtoSchema) {}
