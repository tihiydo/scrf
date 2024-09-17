import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Fiction } from './fiction.entity';


export enum ServerKind {
    Hdd = 'hdd',
    Nvme = 'nvme',
  }

@Entity({ name: 'servers' })
export class FragmentsServers {
  @PrimaryGeneratedColumn('increment')
  id: number; // Изменено на number

  @Column({ type: 'varchar' })
  resource: string;

  @Column({
    type: 'enum',
    enum: ServerKind,
    default: ServerKind.Hdd,
  })
  kind: ServerKind;

  @ManyToMany(() => Fiction, (fiction) => fiction.located)
  fictions: Fiction[];
}