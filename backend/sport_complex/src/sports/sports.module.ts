import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sport, SportSchema } from './schemas/sport.schemas';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sport.name, schema: SportSchema },
    ]),
  ],
  controllers: [SportsController],
  providers: [SportsService],
  exports:[MongooseModule]
})
export class SportsModule {}
