import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialFieldDto } from './create-special-field.dto';

export class UpdateSpecialFieldDto extends PartialType(CreateSpecialFieldDto) {}
