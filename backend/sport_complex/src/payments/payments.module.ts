import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payments.schemas';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { FieldTimeSlotsModule } from 'src/field-time-slots/field-time-slots.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }
    ]),
    forwardRef(() => FieldTimeSlotsModule),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService]
})
export class PaymentsModule {}
