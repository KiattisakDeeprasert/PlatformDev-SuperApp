import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeFacilitiesModule } from './type-facilities/type-facilities.module';
import configuration from './app/config/configuration';
import { storageConfig } from './app/config/storage.config';
import { join } from 'path';
import { CourtsModule } from './courts/courts.module';

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
    MulterModule.register({ storage: storageConfig }),
    TypeFacilitiesModule,
    CourtsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
