import { Type } from 'class-transformer';
import { nameDTO } from './name.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

export class CreateSpecialFieldDto {
  @IsObject()
  @ValidateNested()
  @Type(() => nameDTO)
  name: nameDTO;

  @IsOptional()
  specialfieldImage: any;
}
