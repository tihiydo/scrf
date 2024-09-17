import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SubtitleTracksService } from './subtitle-tracks.service';
import { SetSubtitleTrackDto } from './dto/set-subtitle-track.dto';
import { RenameSubtitleTrackDto } from './dto/rename-subtitle-track.dto';
import { ToggleTrackDto } from './dto/toggle-track.dto';

@Controller('subtitle-tracks')
export class SubtitleTracksController {
  constructor(private readonly subtitleTrakcService: SubtitleTracksService) {}

  @Post('/')
  async setSubtitleTrack(@Body() data: SetSubtitleTrackDto) {
    const subtitleTrack =
      await this.subtitleTrakcService.setSubtitleTrack(data);

    return subtitleTrack;
  }

  @Put('/rename/:id')
  async renameSubtitleTrack(
    @Param('id') id: string,
    @Body() body: RenameSubtitleTrackDto,
  ) {
    const renamedSubtitleTrack = await this.subtitleTrakcService.rename(
      id,
      body,
    );

    return renamedSubtitleTrack;
  }

  @Put('/visible/:id')
  async edit(@Param('id') id: string, @Body() body: ToggleTrackDto) {
    const subtitleTrack = await this.subtitleTrakcService.toggle(id, body);

    return subtitleTrack;
  }

  @Delete('/:id')
  async deleteTrack(@Param('id') id: string) {
    const subtitleTrack = await this.subtitleTrakcService.deleteTrack(id);

    return subtitleTrack;
  }

  @Get('/:imdbid')
  async getSubtitleTracks(@Param('imdbid') imdbid: string) {
    const subtitleTracks =
      await this.subtitleTrakcService.getSubtitleTracksByImdbid(imdbid);

    return subtitleTracks;
  }
}
