import { PartialType } from '@nestjs/mapped-types';
import { CreateComplexReservationDto } from './create-complex-reservation.dto';

export class UpdateComplexReservationDto extends PartialType(CreateComplexReservationDto) {}
