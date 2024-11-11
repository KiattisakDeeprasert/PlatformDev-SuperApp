import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './app/config/configuration';
import { storageConfig } from './app/config/storage.config';
import { join } from 'path';
import { FieldsModule } from './fields/fields.module';
import { UsersModule } from './users/users.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { PaymentsModule } from './payments/payments.module';
import { ReservationsModule } from './reservations/reservations.module';
import { FieldTimeSlotsModule } from './field-time-slots/field-time-slots.module';
import { AuthModule } from './auth/auth.module';
import { SportsModule } from './sports/sports.module';
import { ComplexReservationsModule } from './complex-reservations/complex-reservations.module';
import { SpecialFieldModule } from './special-field/special-field.module';
import { SpecialTableModule } from './special-table/special-table.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database'),
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
    MulterModule.register({storage:storageConfig}),
    FieldsModule,
    UsersModule,
    TimeSlotsModule,
    PaymentsModule,
    ReservationsModule,
    FieldTimeSlotsModule,
    AuthModule,
    SportsModule,
    ComplexReservationsModule,
    SpecialFieldModule,
    SpecialTableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
