import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['user', 'userAgent'])
@Entity({ name: 'devices' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  registeredAt: Date;
}
