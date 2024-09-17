import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Roles } from 'decorators/roles.decorator';

@Controller('genres')
export class GenresController 
{
    constructor(private readonly genresService: GenresService) {}

    @Roles(["Admin"])
    @Post()
    create(@Body() createGenreDto: CreateGenreDto) 
    {
        return this.genresService.create(createGenreDto);
    }

    @Roles(["Admin"])
    @Patch()
    update(@Body() updateGenreDto: UpdateGenreDto) 
    {
        return this.genresService.update(updateGenreDto);
    }

    @Get()
    findAll() 
    {
        return this.genresService.findAll();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) 
    {
        return this.genresService.findOne(slug);
    } 
}
