import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionHistory } from './entities/subscriptions-history.entity';
import { Subscriptions, User } from 'src/user/entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionHistory)
    private readonly studiosRepository: Repository<SubscriptionHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canBuyFree(userId: string)
  {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: {subscriptionHistories: true}, select: {id: true, subscriptionHistories: {id: true}}})
    if(user.subscriptionHistories.length == 0)
    {
        return true
    }
    console.warn(user.subscriptionHistories.length)
    return false
  }

  async getUserHistory(userId: string) {
    const history = await this.studiosRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
    });

    return history;
  }

  async createHistoryItem(data: {
    price: number;
    subscriptionType: Subscriptions;
    userId: string;
  }) {
    const user = await this.userRepository.findOne({
      where: {
        id: data.userId,
      },
    });

    const historyItem = this.studiosRepository.create({
      price: data.price,
      type: data.subscriptionType,
      user: user,
    });
    const historyDBItem = await this.studiosRepository.save(historyItem);

    return historyDBItem;
  }
}
