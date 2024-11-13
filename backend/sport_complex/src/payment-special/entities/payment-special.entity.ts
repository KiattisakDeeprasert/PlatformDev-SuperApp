import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { PaymentSpecialStatus } from '../enums/payment-special.enum';
import { ComplexReservationEntity } from 'src/complex-reservations/entities/complex-reservation.entity';
import { ComplexReservation } from 'src/complex-reservations/schemas/complex-reservation.schemas';

export class PaymentSpecialEntity extends MongoEntity {
  @TransformId((v)=> new ComplexReservationEntity(v))
  reservation?: Types.ObjectId | ComplexReservation | null;

  @TransformUrl({ type: 'string' })
  paymentImage: string;

  status: PaymentSpecialStatus;

  dateTime: Date;

  constructor(partial: Partial<PaymentSpecialEntity>) {
    super();
    Object.assign(this, partial);
  }
}
