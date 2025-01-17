import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimeslotDocument = HydratedDocument<Timeslot>;
@Schema()
export class Timeslot {
  id: string
  @Prop({ type: String, required: true })
  start: string;

  @Prop({ type: String, required: true })
  end: string;
}
export const TimeslotSchema = SchemaFactory.createForClass(Timeslot);

TimeslotSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
TimeslotSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
