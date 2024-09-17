import { IsBoolean, IsEmail, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  slug: string;

  @IsString()
  genreName: string;
}