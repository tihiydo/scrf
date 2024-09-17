import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional, Length, IsDate, IsArray, IsDateString, IsBoolean, isNumber } from 'class-validator';

export class UpdateMoviesDto {
    @IsString()
    @Length(1, 255)
    imdbid: string;

    @IsString()
    @Length(1, 255)
    title: string;

    @IsString()
    @Length(1, 255)
    slug: string;

    @IsString()
    @Length(1, 255)
    portraitImage: string;

    @IsString()
    description: string;

    @IsString()
    fullDescription: string;

    @IsInt()
    voteCount: number;

    @IsNumber()
    rating: number;

    @IsInt()
    runtime: number;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date;

    @IsDate()
    @Type(() => Date)
    addedAt: Date;

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

    @IsNotEmpty()
    @IsBoolean()
    checked: boolean

    // @IsInt()
    // serverId: number
}
