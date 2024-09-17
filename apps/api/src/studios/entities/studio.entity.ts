import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'studios' })
export class Studios {
  @PrimaryColumn({ name: 'imdbid', length: 255 })
  imdbid: string;

  @Column({ name: 'studioName', length: 255 })
  studioName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Fiction, (fiction) => fiction.studios)
  studiosFictions: Fiction[];
}
