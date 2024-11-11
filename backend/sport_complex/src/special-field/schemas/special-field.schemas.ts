import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpecialFieldDocument = HydratedDocument<SpecialField>;
@Schema()
export class SpecialField {
  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  name: { th: string; en: string };

  @Prop({ type: String, required: false })
  specialfieldImage: string;
}
export const SpecialFieldSchema = SchemaFactory.createForClass(SpecialField);
SpecialFieldSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
SpecialFieldSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
