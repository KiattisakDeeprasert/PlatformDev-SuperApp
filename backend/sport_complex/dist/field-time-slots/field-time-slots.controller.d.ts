import { FieldTimeSlotsService } from './field-time-slots.service';
import { CreateFieldTimeSlotDto } from './dto/create-field-time-slot.dto';
import { UpdateFieldTimeSlotDto } from './dto/update-field-time-slot.dto';
export declare class FieldTimeSlotsController {
    private readonly fieldTimeSlotsService;
    constructor(fieldTimeSlotsService: FieldTimeSlotsService);
    create(createFieldTimeSlotDto: CreateFieldTimeSlotDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFieldTimeSlotDto: UpdateFieldTimeSlotDto): string;
    remove(id: string): string;
}
