import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AudioTracksService } from './audio-tracks.service';
import { SetAudioTrackDto } from './dto/set-audio-track.dto';
import { RenameAudioTrackDto } from './dto/rename-audio-track.dto';
import { ToggleTrackDto } from './dto/toggle-track.dto';

@Controller('audio-tracks')
export class AudioTracksController {
  constructor(private readonly audioTrakcService: AudioTracksService) {}

  @Post('/')
  async setAudioTrack(@Body() data: SetAudioTrackDto) {
    const audioTrack = await this.audioTrakcService.setAudioTrack(data);

    return audioTrack;
  }

  @Put('/rename/:id')
  async renameAudioTrack(
    @Param('id') id: string,
    @Body() body: RenameAudioTrackDto,
  ) {
    const renamedAudioTrack = await this.audioTrakcService.rename(id, body);

    return renamedAudioTrack;
  }

  @Put('/visible/:id')
  async edit(@Param('id') id: string, @Body() body: ToggleTrackDto) {
    const subtitleTrack = await this.audioTrakcService.toggle(id, body);

    return subtitleTrack;
  }

  @Delete('/:id')
  async deleteTrack(@Param('id') id: string) {
    const subtitleTrack = await this.audioTrakcService.deleteTrack(id);

    return subtitleTrack;
  }

  @Get('/:imdbid')
  async getAudioTracks(@Param('imdbid') imdbid: string) {
    const audioTracks = await this.audioTrakcService.getMediaAudioTracks({
      imdbid,
    });

    return audioTracks;
  }
}
