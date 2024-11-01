import { TransformId } from "src/app/decorator/transform-id.decorator";
import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { PaymentStatus } from "../enums/payment.enum";
import { TransformUrl } from "src/app/decorator/transform-url.decorator";
import { Reservation } from "src/reservations/schemas/reservation.schemas";
import { ReservationEntity } from "src/reservations/entities/reservation.entity";

export class PaymentEntity extends MongoEntity {
  @TransformId((v) => new ReservationEntity(v))
  reservation?: Types.ObjectId | Reservation | null;

  @TransformUrl({ type: "string" })
  paymentImage: string;

  status: PaymentStatus;

  dateTime: Date;

  constructor(partial: Partial<PaymentEntity>) {
    super();
    Object.assign(this, partial);
  }
}