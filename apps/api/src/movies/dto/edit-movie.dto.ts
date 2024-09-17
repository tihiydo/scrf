import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const EditMovieSchema = z.object({
  previewVideoUrl: z.string().optional().nullable(),
});

export class EditMovieDto extends createZodDto(EditMovieSchema) {}
