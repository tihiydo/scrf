import { Module } from '@nestjs/common';
import { TopSectionController } from './top-section.controller';
import { TopSectionService } from './top-section.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopSection } from './entities/top-section.entity';
import { Movies } from 'src/movies/entities/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopSection, Movies])],
  controllers: [TopSectionController],
  providers: [TopSectionService],
  exports: [TopSectionService],
})
export class TopSectionModule {}
