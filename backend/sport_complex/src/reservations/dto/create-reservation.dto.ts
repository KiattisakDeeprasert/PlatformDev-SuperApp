import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { reservationType } from "../enums/reservation.enum";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsMongoId()
  field: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsString()
  @IsOptional()
  @IsIn([
    reservationType.pending,
    reservationType.confirmed,
    reservationType.cancelled,
  ])
  type: reservationType;

  @IsOptional()
  @IsDateString()
  dateTime: Date;

  @IsNotEmpty()
  timeSlot: string;
}