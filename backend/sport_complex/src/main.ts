import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors({
    origin:'*', // Replace with your frontend URL
    credentials: true, // Allow cookies to be included in requests
  });
  await app.listen(port);

}
bootstrap();
