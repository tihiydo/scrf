import { IsString, IsNumber, IsDate, IsBoolean, IsNotEmpty, IsArray, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSerialDto {
  @IsString()
  title: string;

  @IsString()
  portraitImage: string;

  @IsString()
  slug: string;

  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  voteCount: number;

  @IsOptional()
  @IsString()
  fullDescription: string;

  @IsDate()
  @Type(() => Date)
  addedAt: Date;

  @IsBoolean()
  checked: boolean;

  @IsNotEmpty()
  @IsArray()
  genres:
  {
      id: string
  }[]

  @IsNotEmpty()
  @IsArray()
  studios:
  {
      imdbid: string
  }[]

//   @IsInt()
//   serverId: number
}

export class UpdateEpisodeDto {
    @IsString()
    title: string;
  
    @IsString()
    portraitImage: string;
  
    @IsString()
    slug: string;
  
    @IsDate()
    @Type(() => Date)
    releaseDate: Date;
  
    @IsString()
    description: string;
  
    @IsNumber()
    rating: number;
  
    @IsNumber()
    voteCount: number;
  }