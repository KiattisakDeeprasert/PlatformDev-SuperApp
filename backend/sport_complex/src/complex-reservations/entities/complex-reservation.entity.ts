import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Types } from 'mongoose';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TimeslotEntity } from 'src/time-slots/entities/time-slot.entity';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';
import { SpecialFieldEntity } from 'src/special-field/entities/special-field.entity';
import { ComplexReservationStatus } from '../enums/complex-reservation.enum';

export class ComplexReservationEntity extends MongoEntity {
  @TransformId((v) => new SpecialFieldEntity(v))
  field?: Types.ObjectId | SpecialField | null;

  @TransformId((v) => new UserEntity(v))
  user?: Types.ObjectId | User | null;

  status: ComplexReservationStatus;

  dateTime: Date;

  @TransformId((v) => new TimeslotEntity(v))
  timeSlot?: Types.ObjectId | Timeslot | null;

  constructor(partial: Partial<ComplexReservationEntity>) {
    super();
    Object.assign(this, partial);
  }
}
