import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sports' })
export class Sports {
    @PrimaryColumn({type: "int"})
    id: string

    @Column({type: "text"})
    name: string

    @Column({type: "text"})
    icon: string

    @Column({type: 'boolean', default: false})
    visible: boolean
}

@Entity({ name: 'live-events' })
export class LiveEvents {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ name: 'matchId', type: 'int', nullable: false, unique: true })
  matchId: number;

  @Column({ name: 'firstName', type: 'text', nullable: true })
  firstName: string;

  @Column({ name: 'firstLogo', type: 'text', nullable: true })
  firstLogo: string;

  @Column({ name: 'secondName', type: 'text', nullable: true })
  secondName: string;

  @Column({ name: 'secondLogo', type: 'text', nullable: true })
  secondLogo: string;

  @Column({ name: 'eventName', type: 'text', nullable: true })
  eventName: string

  @Column({ name: 'startAt', type: 'int', nullable: false })
  startAt: number;

  @Column({ name: 'liveStream', type: 'text', nullable: true, default: null })
  liveStream: string;

  @ManyToOne(() => Sports, (sport) => sport.id)
  @Column({ name: 'sportId', type: 'int', nullable: false })
  sportId: number;

  //FOR FOOTBAL
  @Column({ name: 'leagueId', nullable: true})
  leagueId: number;

  //FOR FOOTBAL
  @Column({ name: 'leagueName', type: 'text', nullable: true })
  leagueName: string;

}