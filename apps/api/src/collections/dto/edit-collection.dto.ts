import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
  ArrayUnique,
} from 'class-validator';

export class EditCollectionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @IsString({ each: true })
  fictions?: string[];
}
