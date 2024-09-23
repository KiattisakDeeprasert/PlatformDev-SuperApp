import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TypeFacilitiesDocument = HydratedDocument<TypeFacilities>;
@Schema()
export class TypeFacilities {
  @Prop(
    raw({
      th: { type: String, required: true},
      en: { type: String, required: true},
    }),
  )
  name: { th: string; en: string };
}
export const TypeFacilitiesSchema = SchemaFactory.createForClass(TypeFacilities);
TypeFacilitiesSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
TypeFacilitiesSchema.set('toObject', { flattenObjectIds: true, versionKey: false });