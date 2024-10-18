import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldTimeSlotDto } from './create-field-time-slot.dto';

export class UpdateFieldTimeSlotDto extends PartialType(CreateFieldTimeSlotDto) {}
