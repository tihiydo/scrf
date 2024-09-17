import { IsEnum, IsString } from 'class-validator';
import { SubtitleTrackMediaKind } from '../entities/subtitle-track.entity';

export class SetSubtitleTrackDto {
  @IsString()
  name: string;

  @IsEnum(SubtitleTrackMediaKind)
  kind: SubtitleTrackMediaKind;

  @IsString()
  m3u8Id: string;

  @IsString()
  imdbid: string;
}
