import { Injectable } from '@nestjs/common';
import { CreateFieldTimeSlotDto } from './dto/create-field-time-slot.dto';
import { UpdateFieldTimeSlotDto } from './dto/update-field-time-slot.dto';

@Injectable()
export class FieldTimeSlotsService {
  create(createFieldTimeSlotDto: CreateFieldTimeSlotDto) {
    return 'This action adds a new fieldTimeSlot';
  }

  findAll() {
    return `This action returns all fieldTimeSlots`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldTimeSlot`;
  }

  update(id: number, updateFieldTimeSlotDto: UpdateFieldTimeSlotDto) {
    return `This action updates a #${id} fieldTimeSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldTimeSlot`;
  }
}
