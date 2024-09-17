import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Serial } from './serials.entity';
import { Episode } from './episodes.entity';

@Entity({ name: 'seasons' })
@Unique(['serialImdbid', 'position'])
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'int', nullable: true })
  episodesCount?: number;

  @ManyToOne(() => Serial, (serial) => serial.seasons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serialImdbid' })
  serial: Serial;

  @Column({ name: 'serialImdbid' })
  serialImdbid: string;

  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];
}
