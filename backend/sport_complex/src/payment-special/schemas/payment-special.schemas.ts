import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PaymentSpecialStatus } from '../enums/payment-special.enum';
import { ComplexReservation } from 'src/complex-reservations/schemas/complex-reservation.schemas';

export type PaymentSpecialDocument = HydratedDocument<PaymentSpecial>;
@Schema()
export class PaymentSpecial {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'ComplexReservation',
    required: true,
  })
  reservation: ComplexReservation | Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    required: false,
    default: 'pending',
  })
  status: PaymentSpecialStatus;

  @Prop({ type: String, required: false })
  paymentImage: string;

  @Prop({ type: Date, required: true, default: Date.now })
  dateTime?: Date;

  id:string;
}
export const PaymentSpecialSchema =
  SchemaFactory.createForClass(PaymentSpecial);
PaymentSpecialSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
PaymentSpecialSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
