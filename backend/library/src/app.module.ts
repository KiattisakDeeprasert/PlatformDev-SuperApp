import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './app/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from './app/config/storage.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BookCategoriesModule } from './book-categories/book-categories.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RenewsModule } from './renews/renews.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { RoomTimeslotsModule } from './room-timeslots/room-timeslots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongodb.uri'),
        dbName: config.get<string>('mongodb.dbName'),
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: config.get('upload.apiPath'),
        },
      ],
    }),
    MulterModule.register({ storage: storageConfig }),
    BooksModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    BookCategoriesModule,
    RoomsModule,
    RoomTypesModule,
    ReservationsModule,
    RenewsModule,
    TimeslotsModule,
    RoomTimeslotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
