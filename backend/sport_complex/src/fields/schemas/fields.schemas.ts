import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Sport } from 'src/sports/schemas/sport.schemas';
import { FieldStatus } from '../enums/field-status.enum';

export type FieldsDocument = HydratedDocument<Field>;
@Schema()
export class Field {
  @Prop({ type: Number, required: true ,default:1})
  capacity: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Sport', required: true })
  type: Sport | Types.ObjectId;

  @Prop({ type: String, default: FieldStatus.ready })
  status: FieldStatus;

  @Prop({ type: Number, required: true })
  price: number;
}
export const FieldSchema = SchemaFactory.createForClass(Field);

FieldSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
FieldSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
