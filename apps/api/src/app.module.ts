import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DownloadsModule } from './downloads/downloads.module';
import { MoviesModule } from './movies/movies.module';
import { JwtParserMiddleware } from 'src/middlewares/jwt-parser.middleware';
import { GenresModule } from './genres/genres.module';
import { PersonalityModule } from './personality/personality.module';
import { StudiosModule } from './studios/studios.module';
import { SearchModule } from './search/search.module';
import { InitialDataModule } from './initial-data/initial-data.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TopSectionModule } from './top-section/top-section.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SerialsModule } from './serials/serials.module';
import { FictionsModule } from './fictions/fictions.module';
import { ListsModule } from './lists/lists.module';
import { AudioTracksModule } from './audio-tracks/audio-tracks.module';
import { SubtitleTracksModule } from './subtitle-tracks/subtitle-tracks.module';
import { CollectionsModule } from './collections/collections.module';
import { EventsModule } from './events/events.module';
import { BroadcastsModule } from './broadcasts/broadcasts.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true, //true
        ssl: !!parseInt(configService.get('DATABASE_SSL')),
        logging: false,
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads', // Ensure this directory exists
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
    AuthModule,
    UserModule,
    DownloadsModule,
    MoviesModule,
    GenresModule,
    PersonalityModule,
    StudiosModule,
    SearchModule,
    InitialDataModule,
    UploadModule,
    TopSectionModule,
    SubscriptionsModule,
    SerialsModule,
    FictionsModule,
    ListsModule,
    AudioTracksModule,
    SubtitleTracksModule,
    CollectionsModule,
    EventsModule,
    BroadcastsModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtParserMiddleware).forRoutes('*');
  }
}
