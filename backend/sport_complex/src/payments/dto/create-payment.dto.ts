import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../enums/payment.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  reservation: string;

  @IsOptional()
  paymentImage?: string;

  @IsString()
  @IsOptional()
  @IsIn([PaymentStatus.pending, PaymentStatus.completed, PaymentStatus.cancelled])
  status: PaymentStatus;
  
  @IsOptional()
  @IsDateString()
  dateTime: Date;
}
