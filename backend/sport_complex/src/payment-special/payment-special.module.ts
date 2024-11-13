import { forwardRef, Module } from '@nestjs/common';
import { PaymentSpecialService } from './payment-special.service';
import { PaymentSpecialController } from './payment-special.controller';
import {
  PaymentSpecial,
  PaymentSpecialSchema,
} from './schemas/payment-special.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialTableModule } from 'src/special-table/special-table.module';
import { ComplexReservationsModule } from 'src/complex-reservations/complex-reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSpecial.name, schema: PaymentSpecialSchema },
    ]),
    forwardRef(() => ComplexReservationsModule),
    forwardRef(() => SpecialTableModule),
  ],
  controllers: [PaymentSpecialController],
  providers: [PaymentSpecialService],
  exports: [PaymentSpecialService],
})
export class PaymentSpecialModule {}
