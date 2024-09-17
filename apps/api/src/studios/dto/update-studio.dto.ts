import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateStudioDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  imdbid: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  studioName: string;
}