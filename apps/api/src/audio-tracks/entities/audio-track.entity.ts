import { Movies } from 'src/movies/entities/movies.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const AudioTrackKind = {
  Episode: 'episode',
  Movie: 'movie',
} as const;
export type AudioTrackKind = ObjectValues<typeof AudioTrackKind>;

@Entity({ name: 'audio-tracks' })
export class AudioTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  m3u8Id: string;

  @Column({ name: 'originalName', type: 'text', default: 'Default audio' })
  originalName: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  kind: AudioTrackKind;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @ManyToOne(() => Movies, (movie) => movie.audioTracks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie?: Movies;

  @Column({ name: 'movieId', nullable: true })
  movieId?: string;

  @ManyToOne(() => Episode, (episode) => episode.audioTracks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'episodeId' })
  episode?: Episode;

  @Column({ name: 'episodeId', nullable: true })
  episodeId?: string;
}
