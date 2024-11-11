import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';
import { ComplexReservationStatus } from '../enums/complex-reservation.enum';

export type ComplexReservationDocument = HydratedDocument<ComplexReservation>;
@Schema()
export class ComplexReservation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'SpecialField',
    required: true,
  })
  name: SpecialField | Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    required: false,
    default: 'pending',
  })
  status: ComplexReservationStatus;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User | Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  dateTime?: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Timeslot',
    required: true,
  })
  timeSlot?: Timeslot | Types.ObjectId;
}
export const ComplexReservationSchema =
  SchemaFactory.createForClass(ComplexReservation);
ComplexReservationSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
ComplexReservationSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
