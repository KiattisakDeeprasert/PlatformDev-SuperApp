import { TransformId } from "src/app/decorator/transform-id.decorator";
import { reservationType } from "../enums/reservation.enum";
import { Types } from "mongoose";
import { UserEntity } from "src/users/entities/user.entity";
import { User } from "src/users/schemas/user.schema";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { FieldEntity } from "src/fields/entities/field.entity";
import { TimeslotEntity } from "src/time-slots/entities/time-slot.entity";
import { Timeslot } from "src/time-slots/schemas/time-slots.schema";
import { Field } from "src/fields/schemas/fields.schemas";

export class ReservationEntity extends MongoEntity {
  @TransformId((v) => new FieldEntity(v))
  field?: Types.ObjectId | Field | null;

  @TransformId((v) => new UserEntity(v))
  user?: Types.ObjectId | User | null;

  type: reservationType;

  dateTime: Date;

  @TransformId((v) => new TimeslotEntity(v))
  timeSlot?: Types.ObjectId | Timeslot | null;

  constructor(partial: Partial<ReservationEntity>) {
    super();
    Object.assign(this, partial);
  }
}