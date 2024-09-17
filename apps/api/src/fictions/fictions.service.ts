import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fiction, FictionKind } from './entities/fiction.entity';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { getKindWhere } from './utils';
import { CastKind } from './types/casts';
import { FragmentsServers } from './entities/server.entity';
import { MagicFind } from './dto/magic-find.dto';

@Injectable()
export class FictionsService {
  constructor(
    @InjectRepository(Fiction)
    private readonly fictionsRepository: Repository<Fiction>,

    @InjectRepository(FragmentsServers)
    private readonly fragmentsServersRepository: Repository<FragmentsServers>,

  ) {}

  async magicFind(data : MagicFind)
  {
    let serverId: number | undefined = undefined;
    const servers = await this.getFragmentsServers()

    for (const element of servers) 
    {
        try 
        {
            if(data.kind == "movie")
            {
                const response = await fetch(`${element.resource}/movie/${data.imdbid}/playlist.m3u8`, { signal: AbortSignal.timeout(5000)});
                if (response.status === 200) 
                {
                    serverId = element.id;
                    break;
                }
            }
            else if(data.kind == "serial")
            {
                const response = await fetch(`${element.resource}/serial/${data.imdbid}/1/1/playlist.m3u8`, { signal: AbortSignal.timeout(5000)});
                if (response.status === 200) 
                {
                    serverId = element.id;
                    break;
                }
            }
        } 
        catch (error) 
        {
            continue
        }
    }
    return undefined
  }

  async getFragmentsServers()
  {
    const servers = await this.fragmentsServersRepository.find()
    return servers
  }


  async getCrew(kind: FictionKind, id: string, cast: CastKind[]) {
    const where = getKindWhere(kind, id);
    let selectOptions: FindOptionsSelect<Fiction> = {};
    let relationsOptions: FindOptionsRelations<Fiction> = {};

    if (cast.length === 0) {
      selectOptions = {
        casts: {
          personName: true,
          photoUrl: true,
          imdbid: true,
        },
        directors: {
          personName: true,
          photoUrl: true,
          imdbid: true,
        },
        writers: {
          personName: true,
          photoUrl: true,
          imdbid: true,
        },
      };

      relationsOptions = {
        casts: true,
        directors: true,
        writers: true,
      };
    }

    if (cast.includes('actor')) {
      selectOptions.casts = {
        personName: true,
        photoUrl: true,
        imdbid: true,
      };
      relationsOptions.casts = true;
    }

    if (cast.includes('director')) {
      selectOptions.directors = {
        personName: true,
        photoUrl: true,
        imdbid: true,
      };
      relationsOptions.directors = true;
    }

    if (cast.includes('writer')) {
      selectOptions.writers = {
        personName: true,
        photoUrl: true,
        imdbid: true,
      };
      relationsOptions.writers = true;
    }

    const fiction = await this.fictionsRepository.findOne({
      where: where,
      select: selectOptions,
      relations: relationsOptions,
    });

    return {
      actors: fiction.casts,
      writers: fiction.writers,
      directors: fiction.directors,
    };
  }

  async getStudios(kind: FictionKind, id: string) {
    const where = getKindWhere(kind, id);

    const fiction = await this.fictionsRepository.findOne({
      where: where,
      relations: {
        studios: true,
      },
    });

    return fiction.studios;
  }

  async getGenres(kind: FictionKind, id: string) {
    const where = getKindWhere(kind, id);

    const fiction = await this.fictionsRepository.findOne({
      where: where,
      relations: {
        genres: true,
      },
    });

    return fiction.genres;
  }
}
