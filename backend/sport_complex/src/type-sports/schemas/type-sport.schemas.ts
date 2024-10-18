import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TypeSportDocument = HydratedDocument<TypeSport>;
@Schema()
export class TypeSport {
  @Prop(
    raw({
      th: { type: String, required: true},
      en: { type: String, required: true},
    }),
  )
  name: { th: string; en: string };
}
export const TypeSportSchema = SchemaFactory.createForClass(TypeSport);
TypeSportSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
TypeSportSchema.set('toObject', { flattenObjectIds: true, versionKey: false });