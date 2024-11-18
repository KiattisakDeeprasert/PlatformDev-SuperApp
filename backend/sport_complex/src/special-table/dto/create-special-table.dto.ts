import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SpecialTableStatus } from "../enums/special-table.enum";

export class CreateSpecialTableDto {
  @IsNotEmpty()
  @IsMongoId()
  field: string;

  @IsNotEmpty()
  @IsMongoId()
  timeSlot: string;
  
  @IsNumber()
  userCurrent: number
  
  @IsNumber()
  capacity: number

  @IsString()
  @IsIn([SpecialTableStatus.free, SpecialTableStatus.full])
  status: SpecialTableStatus;
}
