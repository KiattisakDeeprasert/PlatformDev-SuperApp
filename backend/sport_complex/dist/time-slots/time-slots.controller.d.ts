import { TimeslotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { TimeslotEntity } from './entities/time-slot.entity';
export declare class TimeslotsController {
    private readonly timeSlotsService;
    private readonly messageBuilder;
    constructor(timeSlotsService: TimeslotsService);
    create(createTimeslotDto: CreateTimeSlotDto): Promise<import("../app/common/dto/response.dto").ResponseDto<TimeslotEntity>>;
    findAll(): Promise<import("../app/common/dto/response.dto").ResponseDto<TimeslotEntity[]>>;
    findOne(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<TimeslotEntity>>;
    update(id: string, updateTimeslotDto: UpdateTimeSlotDto): Promise<import("../app/common/dto/response.dto").ResponseDto<TimeslotEntity>>;
    remove(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<TimeslotEntity>>;
}
