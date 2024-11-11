import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SpecialTableStatus } from "../enums/special-table.enum";

export class CreateSpecialTableDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  timeSlot: string;
  
  @IsNumber()
  userCurrent: number
  
  @IsNumber()
  capacity: number

  @IsString()
  @IsIn([SpecialTableStatus.free, SpecialTableStatus.full])
  status: SpecialTableStatus;
}
