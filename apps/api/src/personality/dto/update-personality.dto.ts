import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePersonalityDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  imdbid: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  personName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  photoUrl: string;
}