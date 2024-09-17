import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SetMoviesDtoSchema = z.object({
  movies: z.array(z.string()),
});

export class SetMoviesDto extends createZodDto(SetMoviesDtoSchema) {}
