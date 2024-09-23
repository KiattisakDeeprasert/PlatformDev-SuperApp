import { IsNotEmpty, IsString } from "class-validator";

export class TypeFacilitiesDTO {
  @IsNotEmpty()
  @IsString()
  th: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}