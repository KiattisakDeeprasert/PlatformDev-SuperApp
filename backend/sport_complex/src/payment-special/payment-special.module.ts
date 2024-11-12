import { forwardRef, Module } from '@nestjs/common';
import { PaymentSpecialService } from './payment-special.service';
import { PaymentSpecialController } from './payment-special.controller';
import {
  PaymentSpecial,
  PaymentSpecialSchema,
} from './schemas/payment-special.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSpecial.name, schema: PaymentSpecialSchema },
    ]),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [PaymentSpecialController],
  providers: [PaymentSpecialService],
  exports: [PaymentSpecialService],
})
export class PaymentSpecialModule {}
