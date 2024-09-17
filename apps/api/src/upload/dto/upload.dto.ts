import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const pathSegmentRegex = /^[a-zA-Z0-9]+$/;

export const UploadDtoSchema = z.object({
  path: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .refine((arg) => {
      if (!arg) return true;
      const segments = arg.split(',');

      return segments.length < 4;
    }, 'Maximum path semgents exceeded')
    .refine((arg) => {
      if (!arg) return true;
      const segments = arg.split(',');

      return segments.every((segment) => {
        return pathSegmentRegex.test(segment);
      });
    }, 'Path segment may only include alphanumeric values')
    .refine((arg) => {
      if (!arg) return true;

      const segments = arg.split(',');

      return segments.every((segment) => {
        return segment.length <= 20;
      });
    }, 'Path segment can only be less then 20 chars'),
  collection: z
    .string()
    .min(3)
    .regex(
      pathSegmentRegex,
      'Path segment may only include alphanumeric values',
    ),
  allowed: z.string().nullable().optional(),
});

export class UploadDto extends createZodDto(UploadDtoSchema) {}
