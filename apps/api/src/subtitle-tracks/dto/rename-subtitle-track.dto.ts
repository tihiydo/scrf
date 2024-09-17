import { IsString } from 'class-validator';

export class RenameSubtitleTrackDto {
  @IsString()
  name: string;
}
