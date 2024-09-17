import { Genres } from 'src/genres/entities/genre.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { Serial } from 'src/serials/entities/serials.entity';
import { Studios } from 'src/studios/entities/studio.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FragmentsServers } from './server.entity';
import { User } from 'src/user/entities/user.entity';
import { CollectionFiction } from 'src/collections/entities/collections-fictions.entity';

export const FictionKind = {
  Movie: 'movie',
  Serial: 'serial',
} as const;
export type FictionKind = ObjectValues<typeof FictionKind>;

@Entity({ name: 'fictions' })
@Unique(['movie', 'serial'])
export class Fiction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  kind: FictionKind;

  @Column({ name: 'slug', length: 255 })
  slug: string;

  @ManyToMany(() => Genres, (genre) => genre.movies, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'genres_fictions' })
  genres: Genres[];

  @ManyToMany(() => Personality, (person) => person.casts, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'casts_fictions' })
  casts: Personality[];

  @ManyToMany(() => Studios, (studio) => studio.studiosFictions, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'studios_fictions' })
  studios: Studios[];

  @ManyToMany(() => Personality, (person) => person.directed, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'directors_fictions' })
  directors: Personality[];

  @ManyToMany(() => Personality, (person) => person.writer, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'writers_fictions' })
  writers: Personality[];

  @OneToOne(() => Movies, (movie) => movie.fiction, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  movie?: Movies;

  @Column({ name: 'movieImdbid', nullable: true })
  movieImdbid?: string;

  @OneToOne(() => Serial, (serial) => serial.fiction, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serialImdbid' })
  serial?: Serial;

  @Column({ name: 'serialImdbid', nullable: true })
  serialImdbid?: string;

  @ManyToMany(() => FragmentsServers, (server) => server.fictions, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'servers_fictions' })
  located: FragmentsServers[];

  @ManyToMany(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'likes_fictions' })
  likedby: User[];

  @ManyToMany(() => User, (user) => user.dislikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'dislikes_fictions' })
  dislikedby: User[];

  @Column({ name: 'checked', default: false })
  checked: boolean;

  @OneToMany(
    () => CollectionFiction,
    (collectionFiction) => collectionFiction.fiction,
  )
  collectionFictions: CollectionFiction[];
}
