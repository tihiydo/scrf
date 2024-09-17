import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'broadcasts' })

export class Broadcasts {
  @PrimaryColumn({type: "int"})
  id: number;
  
  @Column({ name: 'channelName', nullable: false})
  channelName: string;

  @Column({ name: 'channelLink', nullable: false })
  channelLink: string;
}
