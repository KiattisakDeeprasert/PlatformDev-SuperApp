import {
    IsIn,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from "class-validator";
import { FieldStatus } from "../enums/field-status.enum";
  export class CreateFieldDto {
    @IsNotEmpty()
    @IsNumber()
    capacity: number;
  
    @IsString()
    @IsIn([FieldStatus.ready, FieldStatus.not_ready])
    status: FieldStatus;
  
    @IsMongoId()
    @IsNotEmpty()
    type: string;
  }