import {
  type Repository,
  type FindOptionsWhere,
  FindManyOptions,
} from 'typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as sha256 from 'sha256';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions, User } from './entities/user.entity';
import { removeKeysFromObject } from 'src/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly listsService: ListsService,
  ) {}

  async getUsers(options: FindManyOptions<User>) {
    const users = await this.userRepo.find(options);

    return users;
  }

  async deleteUser(id: string) {
    const __dangerousUser = await this.userRepo.findOneBy({
      id: id,
    });
    if (!__dangerousUser) throw new NotFoundException('User not found');
    if (__dangerousUser.role === 'Admin') {
      throw new BadRequestException("Admin can't be deleted");
    }

    await this.userRepo.delete({
      id: __dangerousUser.id,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = sha256(createUserDto.password);
    const user = this.userRepo.create({
      email: createUserDto.email,
      hashedPassword,
      userName: 'Screenify user',
    });

    const dbUser = await this.userRepo.save(user);

    await this.listsService.createInitialLists(dbUser.id);

    return removeKeysFromObject(dbUser, ['hashedPassword']);
  }

  async getUserBy(options: FindOptionsWhere<User>) {
    const user = await this.userRepo.findOneBy(options);

    return user;
  }

  async updatePassword(email: string, password: string) {
    await this.userRepo.update(
      { email: email },
      { hashedPassword: sha256(password) },
    );
  }

  async toggleBanUser(id: string) {
    const __dangerousUser = await this.userRepo.findOneBy({
      id: id,
    });
    if (!__dangerousUser) throw new NotFoundException('User not found');
    if (__dangerousUser.role === 'Admin') {
      throw new BadRequestException("Admin can't be banned");
    }

    await this.userRepo.update(
      { id: __dangerousUser.id },
      { isBanned: !__dangerousUser.isBanned },
    );

    const updatedUser: User = {
      ...__dangerousUser,
      isBanned: !__dangerousUser.isBanned,
    };
    return removeKeysFromObject(updatedUser, ['hashedPassword']);
  }

  async verify(email: string) {
    await this.userRepo.update(
      {
        email: email,
      },
      {
        verified: new Date(Date.now()),
      },
    );

    const __dangerousUser = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });

    if (!__dangerousUser) {
      throw new NotFoundException('User does not exist');
    }

    return removeKeysFromObject(__dangerousUser, ['hashedPassword']);
  }

  async approveUserSubscription(id: string, free: boolean = false) {
    const user = await this.userRepo.findOneBy({ id });

    const getSubscriptionEndDate = (): string => {
      const currentDate = new Date();
      if(!free)
      {
        currentDate.setDate(currentDate.getDate() + 8);
      }
      else
      { 
        if(user.currentSubscription == 1)
        {
            currentDate.setDate(currentDate.getDate() + 8);
        }
        else if(user.currentSubscription == 2)
        {
            currentDate.setDate(currentDate.getDate() + 15);
        }
        else if(user.currentSubscription == 3)
        {
            currentDate.setDate(currentDate.getDate() + 22);
        }
     }
      return currentDate.toISOString();
    };

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTime = getSubscriptionEndDate();

    try {
      await this.userRepo.update({ id }, { subscriptionExpired: currentTime });
      return { ...user, subscriptionExpired: currentTime };
    } catch (error) {
      throw new HttpException(
        'Failed to update user subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async declineUserSubscription(id: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) {
        throw new Error('User not found');
      }

      await this.userRepo.update(
        { id },
        { subscriptionExpired: null, currentSubscription: null },
      );

      return { ...user, subscriptionExpired: null, currentSubscription: null };
    } catch (error) {
      console.error('Error declining user subscription:', error);
      throw new Error('Could not decline the user subscription');
    }
  }

  async updateSubscription(subscription: Subscriptions, id: string) {
    const user = await this.userRepo.findOneBy({
      id,
    });
    if (user) {
      await this.userRepo.update(
        {
          id,
        },
        { currentSubscription: subscription, subscriptionExpired: null },
      );
      return;
    }

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  async updateUser(details: UpdateUserDto, id: string) {
    const user = await this.userRepo.findOneBy({
      id,
    });
    if (user) {
      await this.userRepo.update(
        {
          id,
        },
        { avatarUrl: details.avatarUrl, userName: details.userName },
      );
      return;
    }

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }
}
