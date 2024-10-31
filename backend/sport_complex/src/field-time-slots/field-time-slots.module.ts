import { Module } from '@nestjs/common';
import { FieldTimeSlotsService } from './field-time-slots.service';
import { FieldTimeSlotsController } from './field-time-slots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldTimeSlot, FieldTimeSlotSchema } from './schemas/field-time-slot.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldTimeSlot.name, schema: FieldTimeSlotSchema },
    ]),
  ],
  controllers: [FieldTimeSlotsController],
  providers: [FieldTimeSlotsService],
  exports: [MongooseModule],
})
export class FieldTimeSlotsModule {}
