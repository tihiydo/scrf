import { IsBoolean, IsOptional } from 'class-validator';

export class ToggleTrackDto {
  @IsBoolean()
  @IsOptional()
  visible: boolean;
}
