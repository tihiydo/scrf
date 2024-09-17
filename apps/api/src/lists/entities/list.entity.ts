import { Movies } from 'src/movies/entities/movies.entity';
import { Serial } from 'src/serials/entities/serials.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'lists' })
@Unique(['name', 'user'])
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  slug: string;

  @ManyToOne(() => User, (user) => user.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Movies, (movie) => movie.lists, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'lists_movies' })
  movies: Movies[];

  @ManyToMany(() => Serial, (serial) => serial.lists, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'lists_serials' })
  serials: Serial[];
}
