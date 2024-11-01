import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Reservation } from "src/reservations/schemas/reservation.schemas";
import { PaymentStatus } from "../enums/payment.enum";

export type PaymentDocument = HydratedDocument<Payment>;
@Schema()
export class Payment {

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Reservation",
    required: true,
  })
  reservation: Reservation | Types.ObjectId;
  
  @Prop({
    type: String,
    enum: ["pending", "completed", "cancelled"],
    required: false,
    default: "pending",
  })
  status: PaymentStatus;

  @Prop({ type: String, required: false })
  paymentImage: string;

  @Prop({ type: Date, required: true, default: Date.now })
  dateTime?: Date;
  _id: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
PaymentSchema.set("toObject", {
  flattenObjectIds: true,
  versionKey: false,
});