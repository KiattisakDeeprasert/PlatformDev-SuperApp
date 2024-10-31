import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { FieldTimeSlotStatus } from "../enums/field-time-slot.enum";

export class CreateFieldTimeSlotDto {
  @IsNotEmpty()
  room: string;

  @IsNotEmpty()
  timeSlot: string;

  @IsString()
  @IsIn([FieldTimeSlotStatus.free, FieldTimeSlotStatus.reserved, FieldTimeSlotStatus.in_use])
  status: FieldTimeSlotStatus;
}