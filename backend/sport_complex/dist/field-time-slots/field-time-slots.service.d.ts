import { CreateFieldTimeSlotDto } from './dto/create-field-time-slot.dto';
import { UpdateFieldTimeSlotDto } from './dto/update-field-time-slot.dto';
export declare class FieldTimeSlotsService {
    create(createFieldTimeSlotDto: CreateFieldTimeSlotDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFieldTimeSlotDto: UpdateFieldTimeSlotDto): string;
    remove(id: number): string;
}
