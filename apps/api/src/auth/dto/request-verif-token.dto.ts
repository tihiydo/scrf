import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const RequestVerifTokenDtoSchema = z.object({
  email: z.string().email(),
});

export type RequestVerifTokenDtoType = z.infer<
  typeof RequestVerifTokenDtoSchema
>;

export class RequestVerifTokenDto extends createZodDto(
  RequestVerifTokenDtoSchema,
) {}
