import { Module } from '@nestjs/common';
import { FictionsController } from './fictions.controller';
import { FictionsService } from './fictions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fiction } from './entities/fiction.entity';
import { FragmentsServers } from './entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fiction, FragmentsServers])],
  controllers: [FictionsController],
  providers: [FictionsService],
})
export class FictionsModule {}
