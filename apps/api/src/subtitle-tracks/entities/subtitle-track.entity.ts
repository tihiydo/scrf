import { Movies } from 'src/movies/entities/movies.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const SubtitleTrackMediaKind = {
  Episode: 'episode',
  Movie: 'movie',
} as const;
export type SubtitleTrackMediaKind = ObjectValues<
  typeof SubtitleTrackMediaKind
>;

@Entity({ name: 'subtitle-tracks' })
export class SubtitleTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  m3u8Id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @Column({ type: 'text', default: 'Default subtitile' })
  originalName: string;

  @Column({ type: 'text' })
  mediaKind: SubtitleTrackMediaKind;

  @ManyToOne(() => Movies, (movie) => movie.subtitleTracks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie?: Movies;

  @Column({ name: 'movieId', nullable: true })
  movieId?: string;

  @ManyToOne(() => Episode, (episode) => episode.subtitleTracks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'episodeId' })
  episode?: Episode;

  @Column({ name: 'episodeId', nullable: true })
  episodeId?: string;
}
