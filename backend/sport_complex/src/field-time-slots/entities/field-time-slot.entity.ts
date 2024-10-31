import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { Field } from "src/fields/schemas/fields.schemas";
import { FieldTimeSlotStatus } from "../enums/field-time-slot.enum";
import { TimeslotEntity } from "src/time-slots/entities/time-slot.entity";
import { Timeslot } from "src/time-slots/schemas/time-slots.schema";
import { FieldEntity } from "src/fields/entities/field.entity";

export class FieldTimeSlotEntity extends MongoEntity {
  @TransformId((v) => new FieldEntity(v))
  field?: Types.ObjectId | Field | null;

  @TransformId((v) => new TimeslotEntity(v))
  timeSlot?: Types.ObjectId | Timeslot | null;

  status: FieldTimeSlotStatus;
  constructor(partial: Partial<FieldTimeSlotEntity>) {
    super();
    Object.assign(this, partial);
  }
}