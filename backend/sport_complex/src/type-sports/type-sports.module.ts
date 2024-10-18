import { Module } from '@nestjs/common';
import { TypeSportsService } from './type-sports.service';
import { TypeSportsController } from './type-sports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeSport, TypeSportSchema } from './schemas/type-sport.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypeSport.name, schema: TypeSportSchema },
    ]),
  ],
  controllers: [TypeSportsController],
  providers: [TypeSportsService],
})
export class TypeSportsModule {}
