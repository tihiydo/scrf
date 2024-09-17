import { Subscriptions, User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'subscriptions-history' })
export class SubscriptionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'text', enum: Subscriptions })
  type: Subscriptions;

  @ManyToOne(() => User, (user) => user.subscriptionHistories, { cascade: true, onDelete: "CASCADE" })
  user: User;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
