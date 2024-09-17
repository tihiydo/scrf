import { IsIn, IsString } from 'class-validator';

export class MagicFind 
{
  @IsIn(['movie', 'serial'])
  kind: string;

  @IsString({ message: 'imdbid must be a string' })
  imdbid: string;
}
