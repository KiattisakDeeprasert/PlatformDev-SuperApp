import { Module } from '@nestjs/common';
import { FieldTimeSlotsService } from './field-time-slots.service';
import { FieldTimeSlotsController } from './field-time-slots.controller';

@Module({
  controllers: [FieldTimeSlotsController],
  providers: [FieldTimeSlotsService],
})
export class FieldTimeSlotsModule {}
