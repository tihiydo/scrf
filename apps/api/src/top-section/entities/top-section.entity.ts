import { Movies } from 'src/movies/entities/movies.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export const TopSectionPage = {
  Home: 'Home',
  FilmsCat: 'FilmsCat',
  SerialsCat: 'SerialsCat',
  Collections: 'Collections',
} as const;
export type TopSectionPage = ObjectValues<typeof TopSectionPage>;

@Entity()
export class TopSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'page', type: 'text', unique: true })
  page: TopSectionPage;

  @ManyToMany(() => Movies, (movie) => movie.topSections)
  movies: Movies[];
}
