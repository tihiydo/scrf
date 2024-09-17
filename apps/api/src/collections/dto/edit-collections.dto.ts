import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class EditCollectionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  collections: string[];
}
