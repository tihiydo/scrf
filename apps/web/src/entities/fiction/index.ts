import { Genre } from "../genre";
import { Movie } from "../movie";
import { Personality } from "../pesonality";
import { Serial } from "../serial";
import { Studio } from "../studio";

export const FictionKind = {
  Movie: 'movie',
  Serial: 'serial',
} as const;
export type FictionKind = ObjectValues<typeof FictionKind>;


export type Fiction = {
  id: string;
  kind: FictionKind;
  slug: string;
  serial?: Serial;
  movie?: Movie;
  genres?: Genre[];
  studios?: Studio[]
  casts?: Personality[];
  writers?: Personality[];
  directors?: Personality[];
  checked: boolean,
  server?: 
  {
    id: number,
    resource: string
  } 
}