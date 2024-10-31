import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { FieldTimeSlotStatus } from "../enums/field-time-slot.enum";
import { Timeslot } from "src/time-slots/schemas/time-slots.schema";
import { Field } from "src/fields/schemas/fields.schemas";

export type RoomTimeSlotDocument = HydratedDocument<FieldTimeSlot>;
@Schema()
export class FieldTimeSlot {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Field",
    required: true,
    default: () => null,
  })
  field: Field | Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Timeslot",
    required: true,
    default: () => null,
  })
  timeSlot: Timeslot | Types.ObjectId;

  @Prop({ type: String, enum: ["free", "reserved", "in use"], default: "free" })
  status: FieldTimeSlotStatus;
}

export const FieldTimeSlotSchema = SchemaFactory.createForClass(FieldTimeSlot);
FieldTimeSlotSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
FieldTimeSlotSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});