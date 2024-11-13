import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaymentSpecialStatus } from '../enums/payment-special.enum';

export class CreatePaymentSpecialDto {
  @IsNotEmpty()
  @IsMongoId()
  reservation: Types.ObjectId;
  
  @IsOptional()
  paymentImage: any;

  @IsString()
  @IsOptional()
  @IsIn([
    PaymentSpecialStatus.pending,
    PaymentSpecialStatus.completed,
    PaymentSpecialStatus.cancelled,
  ])
  status: PaymentSpecialStatus;

  @IsOptional()
  @IsDateString()
  dateTime: Date;
}
