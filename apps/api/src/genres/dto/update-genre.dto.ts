import { IsBoolean, IsEmail, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class UpdateGenreDto {
  @IsString()
  slug: string;

  @IsString()
  genreName: string;
}