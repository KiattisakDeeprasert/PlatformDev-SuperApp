import {
    IsIn,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from "class-validator";
import { FieldStatus } from "../enums/field-status.enum";
  export class CreateFieldDto {
    @IsNotEmpty()
    @IsNumber()
    capacity: number;
  
    @IsOptional()
    @IsString()
    @IsIn([FieldStatus.ready, FieldStatus.not_ready])
    status: FieldStatus;
  
    @IsMongoId()
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    price: number
  }