import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../enums/payment.enum';
import { Types } from 'mongoose';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  reservation: Types.ObjectId;

  @IsOptional()
  paymentImage: any;

  @IsString()
  @IsOptional()
  @IsIn([PaymentStatus.pending, PaymentStatus.completed, PaymentStatus.cancelled])
  status: PaymentStatus;
  
  @IsOptional()
  @IsDateString()
  dateTime: Date;
}
