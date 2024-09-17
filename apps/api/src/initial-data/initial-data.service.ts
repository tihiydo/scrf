import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DownloadsService } from 'src/downloads/downloads.service';
import { Downloads } from 'src/downloads/entities/downloads.entity';
import { Genres } from 'src/genres/entities/genre.entity';
import { GenresService } from 'src/genres/genres.service';
import { ListsService } from 'src/lists/lists.service';
import { Movies } from 'src/movies/entities/movies.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { PersonalityService } from 'src/personality/personality.service';
import { Studios } from 'src/studios/entities/studio.entity';
import { StudiosService } from 'src/studios/studios.service';
import {
  TopSection,
  TopSectionPage,
} from 'src/top-section/entities/top-section.entity';
import {
  AdminRole,
  Subscriptions,
  User,
  UserRole,
} from 'src/user/entities/user.entity';
import * as sha256 from 'sha256';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class InitialDataService {
  constructor(
    private readonly personalityService: PersonalityService,

    private readonly studiosService: StudiosService,

    private readonly genresService: GenresService,

    private readonly downloadsService: DownloadsService,

    private readonly listsService: ListsService,

    @InjectRepository(Downloads)
    private readonly downloadsRepository: Repository<Downloads>,

    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,

    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,

    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Studios)
    private readonly studiosRepository: Repository<Studios>,

    @InjectRepository(TopSection)
    private readonly topSectionRepository: Repository<TopSection>,
  ) {}

  async generate() {
    await this.createUser({
      email: 'test1@gmail.com',
      password: '1',
      role: UserRole.User,
    });
    await this.createUser({
      email: 'test2@gmail.com',
      password: '1',
      role: UserRole.User,
    });
    await this.createUser({
      email: 'test3@gmail.com',
      password: '1',
      role: UserRole.User,
    });

    await this.createUser({
      email: 'admin@gmail.com',
      password: '1',
      role: UserRole.Admin,
    });

    await this.createUser({
      email: 'content-manager@gmail.com',
      password: '1',
      role: UserRole.ContentManager,
    });

    await this.createUser({
      email: 'sales-team@gmail.com',
      password: '1',
      role: UserRole.SalesTeam,
    });

    await this.createUser({
      email: 'review-manager@gmail.com',
      password: '1',
      role: UserRole.ReviewManager,
    });

    await this.downloadsService.addNewMovieFromNewApi('tt15239678', {
      server: [1],
    });
    await this.downloadsService.addNewMovieFromNewApi('tt9466114', {
      server: [1],
    });
    await this.downloadsService.addNewMovieFromNewApi('tt0361748', {
      server: [1],
    });

    await this.topSectionRepository.save(
      Object.values(TopSectionPage).map((page) => ({
        page,
      })),
    );
  }

  async createUser({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: UserRole;
  }) {
    const userExists = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      await this.listsService.createInitialLists(userExists.id);

      return userExists;
    }

    const hashedPassword = sha256(password);
    const isAdmin = Object.values(AdminRole).includes(role as any);

    await this.usersRepository.upsert(
      {
        email: email,
        hashedPassword: hashedPassword,
        verified: new Date(),
        role: role,
        isBanned: false,
        subscriptionExpired: isAdmin ? new Date('3000-01-01') : undefined,
        currentSubscription: isAdmin ? Subscriptions.pro : undefined,
      },
      ['email'],
    );

    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      select: ['id'],
    });

    return user;
  }
}
