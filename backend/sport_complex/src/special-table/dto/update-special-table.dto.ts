import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialTableDto } from './create-special-table.dto';

export class UpdateSpecialTableDto extends PartialType(CreateSpecialTableDto) {}
