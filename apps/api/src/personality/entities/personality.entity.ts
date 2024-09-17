import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'personality' })
export class Personality {
  @PrimaryColumn({ name: 'imdbid', length: 255 })
  imdbid: string;

  @Column({ name: 'personName', length: 255 })
  personName: string;

  @Column({ name: 'photoUrl', length: 255, nullable: true })
  photoUrl: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Fiction, (person) => person.writers)
  writer: Fiction[];

  @ManyToMany(() => Fiction, (person) => person.directors)
  directed: Fiction[];

  @ManyToMany(() => Fiction, (person) => person.casts)
  casts: Fiction[];
}
