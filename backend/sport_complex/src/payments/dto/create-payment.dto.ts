import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../enums/payment.enum';
import { Types } from 'mongoose';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  reservation: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

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
