import { Model } from 'mongoose';
import { Timeslot } from './schemas/time-slots.schema';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
export declare class TimeslotsService {
    private readonly timeslotModel;
    private readonly errorBuilder;
    constructor(timeslotModel: Model<Timeslot>);
    create(createTimeSlotDto: CreateTimeSlotDto): Promise<Timeslot>;
    findAll(): Promise<Timeslot[]>;
    findOne(id: string): Promise<Timeslot>;
    update(id: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<Timeslot>;
    remove(id: string): Promise<Timeslot>;
}
