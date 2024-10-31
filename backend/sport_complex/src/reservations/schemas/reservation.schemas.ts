import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { reservationType } from "../enums/reservation.enum";
import { Timeslot } from "src/time-slots/schemas/time-slots.schema";
import { Field } from "src/fields/schemas/fields.schemas";

export type ReservationDocument = HydratedDocument<Reservation>;
@Schema()
export class Reservation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Field",
    required: true,
  })
  field: Field | Types.ObjectId;
  
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  })
  user: User | Types.ObjectId;

  @Prop({
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    required: false,
    default: "pending",
  })
  type: reservationType;

  @Prop({ type: Date, required: true, default: Date.now })
  dateTime?: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Timeslot",
    required: true,
  })
  timeSlot?: Timeslot | Types.ObjectId;
}
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
ReservationSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});