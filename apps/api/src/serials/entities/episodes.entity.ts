import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Season } from './seasons.entity';
import { Serial } from './serials.entity';
import { AudioTrack } from 'src/audio-tracks/entities/audio-track.entity';
import { SubtitleTrack } from 'src/subtitle-tracks/entities/subtitle-track.entity';

@Entity({ name: 'episodes' })
@Unique(['serialImdbid', 'imdbid', 'position'])
export class Episode {
  @PrimaryColumn({ name: 'imdbid', length: 255 })
  imdbid: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'slug', length: 255 })
  slug: string;

  @Column({ name: 'portraitImage', length: 255, nullable: true })
  portraitImage?: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'voteCount', type: 'int', nullable: true })
  voteCount?: number;

  @Column({ name: 'rating', type: 'float', nullable: true })
  rating?: number;

  @Column({ name: 'releaseDate', type: 'timestamp', nullable: true })
  releaseDate?: Date;

  @Column({ name: 'releaseYear', type: 'int', nullable: true })
  releaseYear?: number;

  @Column({ name: 'runtime', type: 'int', nullable: true })
  runtime?: number;

  @Column()
  position: number;

  @ManyToOne(() => Season, (season) => season.episodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seasonId' })
  season: Season;

  @Column({ name: 'seasonId' })
  seasonId: string;

  @ManyToOne(() => Serial, (serial) => serial.episodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serialImdbid' })
  serial: Serial;

  @Column({ name: 'serialImdbid' })
  serialImdbid: string;

  @OneToMany(() => AudioTrack, (audioTrack) => audioTrack.episode)
  audioTracks: AudioTrack[];

  @OneToMany(() => SubtitleTrack, (subtitleTrack) => subtitleTrack.episode)
  subtitleTracks: SubtitleTrack[];
}
