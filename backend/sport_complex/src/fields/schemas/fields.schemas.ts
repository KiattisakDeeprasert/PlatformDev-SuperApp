import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Sport } from 'src/sports/schemas/sport.schemas';

export type FieldsDocument = HydratedDocument<Field>;
@Schema()
export class Field {
  @Prop({ type: Number, required: true })
  capacity: number;

  @Prop({ type: SchemaTypes.ObjectId,
    ref: "Sport",
    required: true, })
    type: Sport | Types.ObjectId

  @Prop({ type: String, default: "ready" })
  status: string;

  @Prop({ type: Number, required: true })
  price: number;
}
export const FieldSchema = SchemaFactory.createForClass(Field);
FieldSchema.index({ field: 1, type: 1 }, { unique: true });

FieldSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
FieldSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
