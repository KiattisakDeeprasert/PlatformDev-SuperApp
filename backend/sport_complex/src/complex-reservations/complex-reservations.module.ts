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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComplexReservation.name, schema: ComplexReservationSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentsModule),
  ],
  controllers: [ComplexReservationsController],
  providers: [ComplexReservationsService],
  exports: [MongooseModule],
})
export class ComplexReservationsModule {}
