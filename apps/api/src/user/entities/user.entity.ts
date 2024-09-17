import { Device } from 'src/devices/entities/device.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { List } from 'src/lists/entities/list.entity';
import { SubscriptionHistory } from 'src/subscriptions/entities/subscriptions-history.entity';
import { removeKeysFromObject } from 'src/utils';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

export const UserRole = {
  User: 'User',
  Admin: 'Admin',
  ContentManager: 'content-manager',
  ReviewManager: 'review-manager',
  SalesTeam: 'sales-team'

} as const;
export type UserRole = ObjectValues<typeof UserRole>;

export const AdminRole = removeKeysFromObject(UserRole, ['User'])
export type AdminRole = ObjectValues<typeof AdminRole>;

export enum Subscriptions { 'base' = 1, 'middle', 'pro' };

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  userName: string | null;

  @Column({ nullable: true })
  avatarUrl: string | null

  @Column()
  hashedPassword: string;

  @Column({ name: 'verified', type: 'timestamp', nullable: true })
  verified: Date | null;

  @Column({ name: 'role', type: 'text', default: UserRole.User })
  role: UserRole;

  @Column({ name: 'isBanned', type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpired: Date;

  @OneToMany(() => SubscriptionHistory, (subscriptionHistory) => subscriptionHistory.user)
  subscriptionHistories: SubscriptionHistory[];

  @Column({ nullable: true, type: 'enum', enum: Subscriptions })
  currentSubscription: Subscriptions;

  @OneToMany(() => List, (list) => list.user)
  lists: List[];

  @Column({ name: 'addedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ManyToMany(() => Fiction, (fiction) => fiction.likedby, { onDelete: 'CASCADE' })
  likes: Fiction[];

  @ManyToMany(() => Fiction, (fiction) => fiction.dislikedby, { onDelete: 'CASCADE' })
  dislikes: Fiction[];

  @OneToMany(() => Device, (device) => device.user, { onDelete: 'CASCADE' })
  devices: Device[];
}
