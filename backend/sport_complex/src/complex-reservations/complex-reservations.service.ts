import { Injectable } from '@nestjs/common';
import { CreateComplexReservationDto } from './dto/create-complex-reservation.dto';
import { UpdateComplexReservationDto } from './dto/update-complex-reservation.dto';

@Injectable()
export class ComplexReservationsService {
  create(createComplexReservationDto: CreateComplexReservationDto) {
    return 'This action adds a new complexReservation';
  }

  findAll() {
    return `This action returns all complexReservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} complexReservation`;
  }

  update(id: number, updateComplexReservationDto: UpdateComplexReservationDto) {
    return `This action updates a #${id} complexReservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} complexReservation`;
  }
}
