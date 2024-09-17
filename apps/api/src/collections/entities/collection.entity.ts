import { Fiction } from 'src/fictions/entities/fiction.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CollectionFiction } from './collections-fictions.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_COLLECTION_SLUG')
  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int', unique: true })
  position: number;

  @OneToMany(
    () => CollectionFiction,
    (collectionFiction) => collectionFiction.collection,
  )
  collectionFictions: CollectionFiction[];
}
