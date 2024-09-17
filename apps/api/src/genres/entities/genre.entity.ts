import { Fiction } from 'src/fictions/entities/fiction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Unique,
} from 'typeorm';

@Entity({ name: 'genres' })
export class Genres {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'slug', length: 255, unique: true })
  slug: string;

  @Column({ name: 'genreName', length: 255 })
  genreName: string;

  @ManyToMany(() => Fiction, (fiction) => fiction.genres, {
    onDelete: 'CASCADE',
  })
  movies: Fiction[];
}
