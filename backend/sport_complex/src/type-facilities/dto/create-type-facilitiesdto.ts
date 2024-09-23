import { IsObject, ValidateNested } from "class-validator";
import { TypeFacilitiesDTO } from "./type-facilities.dto";
import { Type } from "class-transformer";

export class CreateTypeFacilitiesDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TypeFacilitiesDTO)
  name: TypeFacilitiesDTO;
}