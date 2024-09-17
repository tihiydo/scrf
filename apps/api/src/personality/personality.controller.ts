import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { Response } from 'express';
import { PersonalityService } from './personality.service';
import { UpdatePersonalityDto } from './dto/update-personality.dto';

@Controller('personality')
export class PersonalityController 
{
  constructor(private readonly personalityService: PersonalityService) {}

    @Get()
    async findAll(@Res() res: Response) 
    {
        res.json(await this.personalityService.findAll())
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) 
    {
        res.json((await this.personalityService.findOne(id)))
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) 
    {
        res.json((await this.personalityService.remove(id)))
    }

    @Put(':id')
    async put(@Param('id') data: UpdatePersonalityDto, @Res() res: Response) 
    {
        res.json((await this.personalityService.create(data)))
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdatePersonalityDto, @Res() res: Response) 
    {
        res.json((await this.personalityService.update(id, data)))
    }
}
