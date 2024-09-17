import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddNewFictionDto } from './dto/add-new-fiction-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Downloads } from './entities/downloads.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Movies } from 'src/movies/entities/movies.entity';
import { errorResponse, goodResponse, imdbApi } from 'src/utils';
import { Personality } from 'src/personality/entities/personality.entity';
import { PersonalityService } from 'src/personality/personality.service';
import slugify from 'slugify';
import { GenresService } from 'src/genres/genres.service';
import { Genres } from 'src/genres/entities/genre.entity';
import { Actors, Title } from './schema';
import { Studios } from 'src/studios/entities/studio.entity';
import { StudiosService } from 'src/studios/studios.service';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { Fiction, FictionKind } from 'src/fictions/entities/fiction.entity';
import { SeriesParser } from './utils/series';
import { parseCrew, parseGenres, parseStudios } from './utils';
import { Serial } from 'src/serials/entities/serials.entity';
import { Season } from 'src/serials/entities/seasons.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import { MovieApiResponse, ResponseMovieFromApi } from './entities/franka-api';
import { AddFictionDto } from 'src/lists/dto/add-fictino.dto';
import { movieFromApi } from 'src/movies/schemas';
import { Response } from 'express';
import { decode } from "he"
import { ResponseMovieFromSerial } from './entities/franka-api-serial';

@Injectable()
export class DownloadsService {
  constructor(
    private readonly personalityService: PersonalityService,

    private readonly studiosService: StudiosService,

    private readonly genresService: GenresService,

    @InjectRepository(Downloads)
    private readonly downloadsRepository: Repository<Downloads>,

    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,

    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,

    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Serial)
    private readonly serialsRepository: Repository<Serial>,

    @InjectRepository(Season)
    private readonly seasonsRepository: Repository<Season>,

    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,

    @InjectRepository(Fiction)
    private readonly fictionRepository: Repository<Fiction>,

    @InjectRepository(Studios)
    private readonly studiosRepository: Repository<Studios>,

    @InjectRepository(FragmentsServers)
    private readonly fragmentsServersRepository: Repository<FragmentsServers>,

    private dataSource: DataSource,
    
  ) {}

  async replaceServer(id: string, serverId: string) 
  {
        // Находим fiction (фильм или сериал) по идентификатору
        const serial = await this.fictionRepository.findOne({
            where: { serialImdbid: id },
            relations: { located: true },
            select: { id: true, serialImdbid: true, located: { id: true } }
        });
        const movie = await this.fictionRepository.findOne({
            where: { movieImdbid: id },
            relations: { located: true },
            select: { id: true, movieImdbid: true, located: { id: true } }
        });
    
        // Определяем fictionEntity (фильм или сериал)
        const fictionEntity = movie || serial;
    
        // Находим сервер по идентификатору
        const serverEntity = await this.fragmentsServersRepository.findOne({
            where: { id: +serverId }
        });
    
        // Если fictionEntity и serverEntity найдены
        if (fictionEntity && serverEntity) {
            fictionEntity.located = [serverEntity]
            await this.fictionRepository.save(fictionEntity);
        }
        return {status: true}
    }

  async removeFragmentsServer(id: string, serverId: string) {
    // Находим fiction (фильм или сериал) по идентификатору
    const serial = await this.fictionRepository.findOne({
        where: { serialImdbid: id },
        relations: { located: true },
        select: { id: true, serialImdbid: true, located: { id: true } }
    });
    const movie = await this.fictionRepository.findOne({
        where: { movieImdbid: id },
        relations: { located: true },
        select: { id: true, movieImdbid: true, located: { id: true } }
    });

    // Определяем fictionEntity (фильм или сериал)
    const fictionEntity = movie || serial;

    // Находим сервер по идентификатору
    const serverEntity = await this.fragmentsServersRepository.findOne({
        where: { id: +serverId }
    });

    // Если fictionEntity и serverEntity найдены
    if (fictionEntity && serverEntity) {
        // Если у fictionEntity есть связанные серверы
        if (fictionEntity.located) {
            // Удаляем serverEntity из массива located, если он там есть
            fictionEntity.located = fictionEntity.located.filter(server => server.id !== serverEntity.id);

            // Сохраняем изменения в базе данных
            await this.fictionRepository.save(fictionEntity);
        }
    }

    // Возвращаем обновленный fictionEntity
    return (await this.getFragmentsServer(id));
    }

  async addFragmentsServer(id: string, serverId: string)
  {
    const serial = await this.fictionRepository.findOne({
        where: { serialImdbid: id },
        relations: { located: true },
        select: { id: true, serialImdbid: true, located: { id: true } }
    });
    const movie = await this.fictionRepository.findOne({
        where: { movieImdbid: id },
        relations: { located: true },
        select: { id: true, movieImdbid: true, located: { id: true } }
    });

    // Определяем fictionEntity (фильм или сериал)
    const fictionEntity = movie || serial;
    const serverEntity = await this.fragmentsServersRepository.findOne({where: {id: +serverId}})
    if (fictionEntity && serverEntity) 
    {
        // Add the new server entity to the existing server entities
        if (!fictionEntity.located) {
            fictionEntity.located = [];
        }
        
        // Add the new server entity if it's not already in the list
        if (!fictionEntity.located.some(server => server.id === serverEntity.id)) 
        {
            fictionEntity.located.push(serverEntity);
            await this.fictionRepository.save(fictionEntity);
        }
    }

    return (await this.getFragmentsServer(id))
  }

  async getFragmentsServer(id: string) {
    const serial = await this.fictionRepository.findOne({where: {serialImdbid: id}, relations: {located: true}, select: {id: true, serialImdbid: true, located: {id: true}}})
    const movie = await this.fictionRepository.findOne({where: {movieImdbid: id}, relations: {located: true}, select: {id: true, movieImdbid: true, located: {id: true}}})
    return movie || serial
  }

  async addNewMovieFromNewApi(id: string, addNewFictionDto: AddNewFictionDto) : Promise<{status: boolean, message?: string}>
  {
    console.log("We get new request", id, addNewFictionDto.server)
    const request = await fetch(`https://streamanflow.one/api.php?method=single_movie&imdb=${id}`)
    const testResponse = (await request.json()) as any

    if(!(testResponse?.status))
    {
        try
        {
            const response = testResponse as ResponseMovieFromApi
            const movie = response.data[0]
            const testMovie = await this.fictionRepository.findOne({where: {movieImdbid: id}, relations: {located: true}, select: {id: true, movieImdbid: true, located: {id: true}}})
            
            if(testMovie !== null)
            {
                if(testMovie?.located?.find((e) => addNewFictionDto.server[0] == e.id))
                {
                    return {status: true, message: `Server id matches`} 
                }
                else
                {
                    return {status: false, message: `Sorry movie, exists on Fragments Servers - ${JSON.stringify(testMovie.located)}`}
                }
            }


            if(parseInt(movie.is_serial) == 0)
            {
                const runtime = movie.runtime_min ? Number(movie.runtime_min) * 60 : 0
                const title = movie?.original_name || movie.name ? (decode(movie?.original_name || movie.name) || "Unknown") : "Unknown"
                const releaseYear = Number(movie?.release_year) || 1111
                const releaseDate = new Date(movie?.release_date || 1111).toISOString()
                const portraitImage = movie?.full_image ? `https://streamanflow.one/full_image/${movie?.full_image}`: null
                const voteCount = Number(movie?.voteCount) || 0
                const rating = parseFloat(movie?.rating) || 0
                const description = movie?.description !== null ? (decode(movie.description) || "") : ""
                const fullDescription = movie?.storyline !== null ? (decode(movie.storyline) || "") : ""
                const slug = slugify(decode(title), { replacement: '-', remove: undefined, lower: true, locale: 'en' }) + '-' + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
                
                const genres = Array.from(new Map(
                    (movie?.genres || [])
                        .filter(el => el.genre_name != null && el.genre_name !== "")
                        .map(el => ({
                            genreName: decode(el.genre_name),
                            slug: slugify(decode(el.genre_name), {
                                replacement: '-',
                                remove: undefined,
                                lower: true,
                                locale: 'en'
                            })
                        }))
                        .map(genre => [genre.slug, genre])
                ).values())

                this.genresRepository.upsert(genres, ['slug'])
            
                const casts = movie?.movie_cast?.map((item) => {
                    if (item.cast_imdbid !== null) 
                    {
                        return { imdbid: item.cast_imdbid, personName: decode(item.cast_name), photoUrl: item.cast_photo != null ? `https://streamanflow.one${item.cast_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
            
                const writers = movie?.movie_writers?.map((item) => {
                    if (item.writer_imdbid !== null) 
                    {
                        return { imdbid: item.writer_imdbid, personName: decode(item.writer_name), photoUrl: item?.writer_imdbid != null ? `https://streamanflow.one${item?.writer_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
                
                const directors = movie?.movie_directors?.map((item) => {
                    if (item.director_imdbid !== null) 
                    {
                        return { imdbid: item.director_imdbid, personName: decode(item.director_name), photoUrl: item.director_photo != null ? `https://streamanflow.one${item.director_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
            
                const unitedPersonality = [...casts, ...writers, ...directors]
                const uniquePersonalities = Array.from(new Map(unitedPersonality.map(item => [item.imdbid, item])).values());
                this.personalityRepository.upsert(uniquePersonalities, ['imdbid'])
            
                const studios = movie?.movie_production_company?.map((item) => {
                    if (item.company_imdbid !== null) 
                    {
                        return { imdbid: item.company_imdbid, studioName: decode(item.company_name) }
                    }
                }).filter(el => el != null && el != undefined && el.imdbid != null && el.studioName != null) || []
                this.studiosRepository.upsert(studios, ['imdbid'])
             
                //////////////////////////////////
            
                const serversEntity = await this.fragmentsServersRepository.findBy({id: In(addNewFictionDto.server)})
            
                const genresEntities = await this.genresRepository.findBy({
                    slug: In(Array.from(new Set(genres.map(({ slug }) => slug)))),
                });
                const castsEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(casts.map(({ imdbid }) => imdbid)))),
                });
            
                const writerEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(writers.map(({ imdbid }) => imdbid)))),
                });
            
                const directorEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(directors.map(({ imdbid }) => imdbid))))
                })
            
                const studiosEntities = await this.studiosRepository.findBy({
                    imdbid: In(Array.from(new Set(studios.map(({ imdbid }) => imdbid))))
                })
            
                //////////////////////////////////
            
                await this.moviesRepository.upsert
                ({
                    imdbid: id,
                    title,
                    releaseDate,
                    releaseYear,
                    portraitImage,
                    voteCount,
                    rating,
                    description,
                    fullDescription,
                    runtime,
                    },
                    ['imdbid'],
                );
            
                const fiction = await this.fictionRepository.upsert
                ({
                    movieImdbid: id,
                    kind: FictionKind.Movie,
                    slug
                }, ['movieImdbid']
                )
                
                //UPDATA MANY-TO-MANY RELATIONS
                if(fiction?.raw?.[0]?.id)
                {
                    const fictionEntity = await this.fictionRepository.findOne({ where: { id: fiction.raw[0].id }});
                    if (fictionEntity) 
                    {
                        fictionEntity.located = serversEntity
                        fictionEntity.casts = castsEntities;
                        fictionEntity.writers = writerEntities;
                        fictionEntity.directors = directorEntities;
                        fictionEntity.studios = studiosEntities;
                        fictionEntity.genres = genresEntities;
                    
                        // Save the updated entity
                        await this.fictionRepository.save(fictionEntity);
                    }
                }
                const mess = encodeURIComponent(`Привіт чувак, ми додали тобі новій ентіті з IDшкою ${id}`)
                fetch(`https://api.telegram.org/bot7459899664:AAEi26nmJSmHlgW3ERl7Y346ujMjEVQJWdo/sendMessage?chat_id=629842697&text=${mess}`)
                fetch(`https://api.telegram.org/bot7459899664:AAEi26nmJSmHlgW3ERl7Y346ujMjEVQJWdo/sendMessage?chat_id=6408787110&text=${mess}`)
                return {status: true}
            }
            else
            {
                return {status: false, message: "Is serial, not movie"}
            } 
        }
        catch(e)
        {
            console.log(e)
            return {status: false, message: "Error parsing data"}
        }
    }
    else
    {
        return {status: false, message: "Movie not fond"}
    }
  }

async addNewSerialFromNewApi(id: string, addNewFictionDto: AddNewFictionDto) : Promise<{status: boolean, message?: string}>
{
    console.log("We get new request", id, addNewFictionDto.server)
    const request = await fetch(`https://streamanflow.one/api.php?method=single_movie&imdb=${id}`)
    const testResponse = (await request.json()) as any

    if(!(testResponse?.status))
    {
        try
        {
            const response = testResponse as ResponseMovieFromSerial
            const serialData = response.data[0]
            const testSerial = await this.fictionRepository.findOne({where: {serialImdbid: id}, relations: {located: true}, select: {id: true, serialImdbid: true, located: {id: true}}})
            
            if(testSerial !== null)
            {
                if(testSerial?.located?.find((e) => addNewFictionDto.server[0] == e.id))
                {
                    return {status: true, message: `Server id matches`}
                }
                else
                {
                    return {status: false, message: `Sorry serial, exists on Fragments Servers - ${JSON.stringify(testSerial.located)}`}
                }
            }
            if(parseInt(serialData.is_serial) == 1)
            {
                const title = serialData?.original_name || serialData.name ? (decode(serialData?.original_name || serialData.name) || "Unknown") : "Unknown"
                const releaseYear = Number(serialData?.release_year) || 1111
                const releaseDate = new Date(serialData?.release_date || 1111).toISOString()
                const portraitImage = serialData?.full_image ? `https://streamanflow.one/full_image/${serialData?.full_image}`: null
                const voteCount = Number(serialData?.voteCount) || 0
                const rating = parseFloat(serialData?.rating) || 0
                const description = serialData?.description !== null ? (decode(serialData.description) || "") : ""
                const fullDescription = serialData?.storyline !== null ? (decode(serialData.storyline) || "") : ""
                const slug = slugify(decode(title), { replacement: '-', remove: undefined, lower: true, locale: 'en' }) + '-' + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
                
                // const genres = Array.from(new Map(
                //     (movie?.genres || [])
                //         .filter(el => el.genre_name != null && el.genre_name !== "")
                //         .map(el => ({
                //             genreName: decode(el.genre_name),
                //             slug: slugify(decode(el.genre_name), {
                //                 replacement: '-',
                //                 remove: undefined,
                //                 lower: true,
                //                 locale: 'en'
                //             })
                //         }))
                //         .map(genre => [genre.slug, genre])
                // ).values())

                // this.genresRepository.upsert(genres, ['slug'])
            
                const casts = serialData?.movie_cast?.map((item) => {
                    if (item.cast_imdbid !== null) 
                    {
                        return { imdbid: item.cast_imdbid, personName: decode(item?.cast_name), photoUrl: item.cast_photo != null ? `https://streamanflow.one${item.cast_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
            
                const writers = serialData?.writers?.map((item) => {
                    if (item.writer_imdbid !== null) 
                    {
                        return { imdbid: item.writer_imdbid, personName: decode(item?.writer_name), photoUrl: item?.writer_imdbid != null ? `https://streamanflow.one${item?.writer_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
                
                const directors = serialData?.director?.map((item) => {
                    if (item.director_imdbid !== null) 
                    {
                        return { imdbid: item.director_imdbid, personName: decode(item?.director_name), photoUrl: item.director_photo != null ? `https://streamanflow.one${item.director_photo}` : null}
                    }
                }).filter(el => el != null && el != undefined && el.personName != null && el.imdbid != null) || []
            
                const unitedPersonality = [...casts, ...writers, ...directors]
                const uniquePersonalities = Array.from(new Map(unitedPersonality.map(item => [item.imdbid, item])).values());
                this.personalityRepository.upsert(uniquePersonalities, ['imdbid'])
            
                const studios = serialData?.movie_production_company?.map((item) => {
                    if (item.company_imdbid !== null && item.company_name !== undefined && item.company_name !== null) 
                    {
                        console.log(item.company_name)
                        return { imdbid: item.company_imdbid, studioName: decode(item?.company_name) }
                    }
                }).filter(el => el != null && el != undefined && el.imdbid != null && el.studioName != null) || []
                this.studiosRepository.upsert(studios, ['imdbid'])
            
                //////////////////////////////////
            
                const serversEntity = await this.fragmentsServersRepository.findBy({id: In(addNewFictionDto.server)})
            
                // const genresEntities = await this.genresRepository.findBy({
                //     slug: In(Array.from(new Set(genres.map(({ slug }) => slug)))),
                // });

                const castsEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(casts.map(({ imdbid }) => imdbid)))),
                });
            
                const writerEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(writers.map(({ imdbid }) => imdbid)))),
                });
            
                const directorEntities = await this.personalityRepository.findBy({
                    imdbid: In(Array.from(new Set(directors.map(({ imdbid }) => imdbid))))
                })
            
                const studiosEntities = await this.studiosRepository.findBy({
                    imdbid: In(Array.from(new Set(studios.map(({ imdbid }) => imdbid))))
                })
            
                //////////////////////////////////
            
                const serial = await this.serialsRepository.upsert
                ({
                    imdbid: id,
                    title,
                    releaseDate,
                    releaseYear,
                    portraitImage,
                    voteCount,
                    rating,
                    description,
                    fullDescription,
                    },
                    ['imdbid'],
                );
                
                console.log("added Serial", serial)

                if(serial.identifiers?.[0]?.imdbid)
                {
                    const serialEntity = await this.serialsRepository.findOneBy({imdbid: serial.identifiers?.[0]?.imdbid})
                    if(serialEntity)
                    {
                        
                        const seasons = serialData.seasons.map((e) => { return {
                            position: Number(e.season_position),
                            episodesCount: Number(e.episodes.length),
                            serial: serialEntity,
                            episodes: e.episodes
                        }})

                        for (const season of seasons)
                        {
                            const seasonRequest = await this.seasonsRepository.upsert({position: season.position, episodesCount: season.episodesCount, serial: season.serial}, {conflictPaths: ['position', 'serialImdbid']})
                                            
                            console.log("added ", season.position)
                            if(seasonRequest?.raw?.[0]?.id)
                            {
                                const seasonEntity = await this.seasonsRepository.findOneBy({id: seasonRequest?.raw?.[0]?.id})
                                for(const episode of season.episodes)
                                {
                                    await this.episodeRepository.upsert({
                                        imdbid: episode.imdb,
                                        season: seasonEntity,
                                        serial: serialEntity,
                                        position: Number(episode?.episodeNumber),
                                        title: episode?.original_name || episode.name ? (decode(episode?.original_name || episode.name) || "Unknown") : "Unknown",
                                        description: serialData?.description !== null ? (decode(serialData.description) || "") : "",
                                        portraitImage: episode?.full_image ? `https://streamanflow.one/full_image/${episode?.full_image}`: null,
                                        rating: Number(episode?.rating) || 0,
                                        releaseYear: Number(episode?.release_year) || 1111,
                                        releaseDate: new Date(episode?.release_date || 1111).toISOString(),
                                        runtime: episode?.runtime_min ? Number(episode?.runtime_min) * 60 : 0,
                                        slug: slugify(decode(episode?.original_name || episode.name ? (decode(episode?.original_name || episode.name) || "Unknown") : "Unknown"), { replacement: '-', remove: undefined, lower: true, locale: 'en' }) + '-' + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString(),
                                        voteCount: Number(episode?.voteCount) || 0,
                                    }, ['imdbid'])
                                }
                            }
                        }
                    }
                }

                const fiction = await this.fictionRepository.upsert
                ({
                    serialImdbid: id,
                    kind: FictionKind.Serial,
                    slug
                }, ['serialImdbid'])
                
                //UPDATA MANY-TO-MANY RELATIONS
                if(fiction?.raw?.[0]?.id)
                {
                    const fictionEntity = await this.fictionRepository.findOne({ where: { id: fiction.raw[0].id }});
                    if (fictionEntity) 
                    {
                        fictionEntity.located = serversEntity
                        fictionEntity.casts = castsEntities;
                        fictionEntity.writers = writerEntities;
                        fictionEntity.directors = directorEntities;
                        fictionEntity.studios = studiosEntities;
                        // fictionEntity.genres = genresEntities;
                    
                        // Save the updated entity
                        await this.fictionRepository.save(fictionEntity);
                    }
                }
                const mess = encodeURIComponent(`Привіт чувак, ми додали тобі новій ентіті з IDшкою ${id}`)
                fetch(`https://api.telegram.org/bot7459899664:AAEi26nmJSmHlgW3ERl7Y346ujMjEVQJWdo/sendMessage?chat_id=629842697&text=${mess}`)
                fetch(`https://api.telegram.org/bot7459899664:AAEi26nmJSmHlgW3ERl7Y346ujMjEVQJWdo/sendMessage?chat_id=6408787110&text=${mess}`)
                return {status: true}
            }
            else
            {
                return {status: false, message: "Is movie, not serial"}
            }
        }
        catch(e)
        {
            console.log(e)
            return {status: false, message: "Error parsing data"}
        }
        finally
        {
            console.log("")
        }
    }
    else
    {
        return {status: false, message: "Serial not fond"}
    }
}



}