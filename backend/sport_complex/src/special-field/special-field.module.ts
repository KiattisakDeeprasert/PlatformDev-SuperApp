import { Module } from '@nestjs/common';
import { SpecialFieldService } from './special-field.service';
import { SpecialFieldController } from './special-field.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpecialField,
  SpecialFieldSchema,
} from './schemas/special-field.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialField.name, schema: SpecialFieldSchema },
    ]),
  ],
  controllers: [SpecialFieldController],
  providers: [SpecialFieldService],
  exports: [MongooseModule],
})
export class SpecialFieldModule {}
