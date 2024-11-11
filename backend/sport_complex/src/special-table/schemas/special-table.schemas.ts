import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';
import { SpecialTableStatus } from '../enums/special-table.enum';
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';

export type SpecialFieldTableDocument = HydratedDocument<SpecialTable>;
@Schema()
export class SpecialTable {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'SpecialField',
    required: true,
    default: () => null,
  })
  name: SpecialField | Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Timeslot',
    required: true,
    default: () => null,
  })
  timeSlot: Timeslot | Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  capacity: number;

  @Prop({ type: Number, default: 0 })
  userCurrent: number;

  @Prop({ type: String, enum: ['free', 'full'], default: 'free' })
  status: SpecialTableStatus;
}

export const SpecialTableSchema = SchemaFactory.createForClass(SpecialTable);
SpecialTableSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
SpecialTableSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
