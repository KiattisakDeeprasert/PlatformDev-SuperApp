import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ComplexReservationStatus } from '../enums/complex-reservation.enum';

export class CreateComplexReservationDto {
  @IsNotEmpty()
  @IsMongoId()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsString()
  @IsOptional()
  @IsIn([
    ComplexReservationStatus.pending,
    ComplexReservationStatus.confirmed,
    ComplexReservationStatus.cancelled,
  ])
  status: ComplexReservationStatus;

  @IsOptional()
  @IsDateString()
  dateTime: Date;

  @IsNotEmpty()
  @IsMongoId()
  timeSlot: string;
}
