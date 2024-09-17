import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { CollectionFiction } from './entities/collections-fictions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Fiction, CollectionFiction])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [TypeOrmModule],
})
export class CollectionsModule {}
