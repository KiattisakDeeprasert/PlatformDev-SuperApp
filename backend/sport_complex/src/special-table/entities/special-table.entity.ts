import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';
import { Types } from 'mongoose';
import { TimeslotEntity } from 'src/time-slots/entities/time-slot.entity';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { SpecialTableStatus } from '../enums/special-table.enum';
import { SpecialFieldEntity } from 'src/special-field/entities/special-field.entity';
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';

export class SpecialTableEntity extends MongoEntity {
  @TransformId((v) => new SpecialFieldEntity(v))
  field?: Types.ObjectId | SpecialField | null;

  @TransformId((v) => new TimeslotEntity(v))
  timeSlot?: Types.ObjectId | Timeslot | null;

  capacity: number;

  userCurrent: number;

  status: SpecialTableStatus;
  constructor(partial: Partial<SpecialTableEntity>) {
    super();
    Object.assign(this, partial);
  }
}
