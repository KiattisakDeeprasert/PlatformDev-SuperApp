import { Module } from '@nestjs/common';
import { TypeFacilitiesService } from './type-facilities.service';
import { TypeFacilitiesController } from './type-facilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeFacilities, TypeFacilitiesSchema } from './schemas/type-facilities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypeFacilities.name, schema: TypeFacilitiesSchema },
    ]),
  ],
  controllers: [TypeFacilitiesController],
  providers: [TypeFacilitiesService],
})
export class TypeFacilitiesModule {}
