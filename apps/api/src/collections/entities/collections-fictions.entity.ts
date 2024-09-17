import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
  Unique,
} from 'typeorm';
import { Collection } from './collection.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';

@Entity({ name: 'collections_fictions' })
@Unique(['collection', 'position'])
export class CollectionFiction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Collection, (collection) => collection.collectionFictions, {
    onDelete: 'CASCADE',
  })
  @Index()
  collection: Collection;

  @ManyToOne(() => Fiction, (fiction) => fiction.collectionFictions, {
    onDelete: 'CASCADE',
  })
  @Index()
  fiction: Fiction;

  @Column({ type: 'int' })
  position: number;
}
