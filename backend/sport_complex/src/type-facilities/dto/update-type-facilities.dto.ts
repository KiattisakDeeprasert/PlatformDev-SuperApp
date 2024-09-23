import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeFacilitiesDto } from './create-type-facilitiesdto';

export class UpdateTypeFacilitiesDto extends PartialType(CreateTypeFacilitiesDto) {}
