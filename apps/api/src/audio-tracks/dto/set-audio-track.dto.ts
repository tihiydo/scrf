import { AudioTrackKind } from '../entities/audio-track.entity';
import { IsEnum, IsString } from 'class-validator';

export class SetAudioTrackDto {
  @IsString()
  name: string;

  @IsEnum(AudioTrackKind)
  kind: AudioTrackKind;

  @IsString()
  m3u8Id: string;

  @IsString()
  imdbid: string;
}
