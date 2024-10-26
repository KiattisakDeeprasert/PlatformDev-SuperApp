import { Module } from '@nestjs/common';
import { TimeslotsService } from './time-slots.service';
import { TimeslotsController } from './time-slots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timeslot, TimeslotSchema } from './schemas/time-slots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timeslot.name, schema: TimeslotSchema },
    ]),
  ],
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  exports: [MongooseModule],
})
export class TimeSlotsModule {}
