import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeSportDto } from './create-type-sport.dto';

export class UpdateTypeSportDto extends PartialType(CreateTypeSportDto) {}
