import {
  Entity,
  OneToMany,
  OneToOne,
  Column,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToMany,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';
import { Season } from './seasons.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Episode } from './episodes.entity';
import { List } from 'src/lists/entities/list.entity';

@Entity({ name: 'serials' })
export class Serial {
  @PrimaryColumn({ name: 'imdbid', length: 255 })
  imdbid: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ type: 'int', nullable: true })
  seasonsCount?: number;

  @Column({ type: 'int', nullable: true })
  episodesCount?: number;

  @Column({ name: 'portraitImage', length: 255, nullable: true })
  portraitImage?: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'fullDescription', type: 'text', nullable: true })
  fullDescription?: string;

  @Column({ name: 'voteCount', type: 'int', nullable: true })
  voteCount?: number;

  @Column({ name: 'rating', type: 'float', nullable: true })
  rating?: number;

  @Column({ name: 'ageRestriction', type: 'int', default: 16 })
  ageRestriction: number;

  @Column({ name: 'releaseDate', type: 'timestamp', nullable: true })
  releaseDate?: Date;

  @Column({ type: 'int', nullable: true })
  releaseYear?: number;

  @Column({ type: 'int', nullable: true })
  endYear?: number;

  @Column({
    name: 'addedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  addedAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Season, (season) => season.serial)
  seasons: Season[];

  @OneToMany(() => Episode, (episode) => episode.serial)
  episodes: Episode[];

  @OneToOne(() => Fiction, (fiction) => fiction.serial)
  fiction: Fiction;

  @ManyToMany(() => List, (list) => list.serials, {
    onDelete: 'CASCADE',
  })
  lists: List[];
}

export const minimalSerialSelect: FindOptionsSelect<Serial> = {
  imdbid: true,
  title: true,
  ageRestriction: true,
  releaseDate: true,
  releaseYear: true,
  endYear: true,
  episodesCount: true,
  seasonsCount: true,
  portraitImage: true,
  rating: true,
  voteCount: true,
  fiction: {
    id: true,
    genres: {
      id: true,
      genreName: true,
      slug: true,
    },
    studios: {
      imdbid: true,
      studioName: true,
    },
  },
};

export const minimalSerialRelations: FindOptionsRelations<Serial> = {
  fiction: {
    genres: true,
    studios: true,
  },
};
