import { forwardRef, Module } from '@nestjs/common';
import { ComplexReservationsService } from './complex-reservations.service';
import { ComplexReservationsController } from './complex-reservations.controller';
import {
  ComplexReservation,
  ComplexReservationSchema,
} from './schemas/complex-reservation.schemas';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialTableModule } from 'src/special-table/special-table.module';
import { PaymentSpecialModule } from 'src/payment-special/payment-special.module';
import { SpecialFieldModule } from 'src/special-field/special-field.module';
import { TimeSlotsModule } from 'src/time-slots/time-slots.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComplexReservation.name, schema: ComplexReservationSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => SpecialTableModule),
    forwardRef(() => PaymentSpecialModule),
    forwardRef(() => SpecialFieldModule),
    forwardRef(() => TimeSlotsModule),
  ],
  controllers: [ComplexReservationsController],
  providers: [ComplexReservationsService],
  exports: [ComplexReservationsService,MongooseModule],
})
export class ComplexReservationsModule {}
