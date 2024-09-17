import { IsString } from 'class-validator';

export class RenameAudioTrackDto {
  @IsString()
  name: string;
}
