import { Module } from '@nestjs/common';
import { StudiosService } from './studios.service';
import { StudiosController } from './studios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studios } from './entities/studio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Studios])],
  controllers: [StudiosController],
  providers: [StudiosService],
  exports: [StudiosService],
})
export class StudiosModule {}
