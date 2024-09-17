import { AudioTrack } from 'src/audio-tracks/entities/audio-track.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { List } from 'src/lists/entities/list.entity';
import { SubtitleTrack } from 'src/subtitle-tracks/entities/subtitle-track.entity';
import { TopSection } from 'src/top-section/entities/top-section.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  FindOptionsSelect,
  FindOptionsRelations,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'movies' })
export class Movies {
  @PrimaryColumn({ name: 'imdbid', length: 255 })
  imdbid: string;

  @Column({ name: 'title', length: 255 })
  title: string;

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

  @Column({ name: 'ageRestriction', type: 'int', default: 16, nullable: true })
  ageRestriction?: number;

  @Column({ name: 'releaseDate', type: 'timestamp', nullable: true })
  releaseDate?: Date;

  @Column({ name: 'releaseYear', type: 'int', nullable: true })
  releaseYear?: number;

  @Column({
    name: 'addedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  addedAt: Date;

  @Column({ name: 'runtime', type: 'int', nullable: true })
  runtime?: number;

  @Column({ name: 'previewVideoUrl', type: 'text', nullable: true })
  previewVideoUrl?: string;

  @ManyToMany(() => TopSection, (topSection) => topSection.movies)
  @JoinTable({ name: 'topsection_movies' })
  topSections?: TopSection[];

  @OneToOne(() => Fiction, (fiction) => fiction.movie)
  fiction?: Fiction;

  @ManyToMany(() => List, (list) => list.movies, { onDelete: 'CASCADE' })
  lists?: List[];

  @OneToMany(() => AudioTrack, (audioTrack) => audioTrack.movie)
  audioTracks?: AudioTrack[];

  @OneToMany(() => SubtitleTrack, (subtitleTrack) => subtitleTrack.movie)
  subtitleTracks?: SubtitleTrack[];
}

export const minimalMovieSelect: FindOptionsSelect<Movies> = {
  imdbid: true,
  title: true,
  ageRestriction: true,
  releaseDate: true,
  releaseYear: true,
  portraitImage: true,
  rating: true,
  runtime: true,
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
  audioTracks: true,
  subtitleTracks: true,
};

export const minimalMovieRelations: FindOptionsRelations<Movies> = {
  fiction: {
    genres: true,
    studios: true,
  },
  audioTracks: true,
  subtitleTracks: true,
};
