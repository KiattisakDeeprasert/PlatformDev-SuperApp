import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { Timeslot } from './schemas/time-slots.schema';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';

@Injectable()
export class TimeslotsService {
  private readonly errorBuilder = new ErrorBuilder('Timeslots');

  constructor(
    @InjectModel(Timeslot.name)
    private readonly timeslotModel: Model<Timeslot>,
  ) {}

  async create(createTimeSlotDto: CreateTimeSlotDto): Promise<Timeslot> {
    try {
      const timeslotDoc = new this.timeslotModel(createTimeSlotDto);
      const timeslot = await timeslotDoc.save();
      return timeslot.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
    }
  }

  async findAll(): Promise<Timeslot[]> {
    const timeslot = await this.timeslotModel.find().lean();
    return timeslot;
  }

  async findOne(id: string): Promise<Timeslot> {
    try {
      const timeslot = await this.timeslotModel.findById(id).lean();
      if (!timeslot) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return timeslot;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTimeSlotDto: UpdateTimeSlotDto,
  ): Promise<Timeslot> {
    const exists = await this.timeslotModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const timeslot = await this.timeslotModel
        .findByIdAndUpdate(id, updateTimeSlotDto, options)
        .lean();
      return timeslot;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Timeslot> {
    const timeslot = await this.timeslotModel.findByIdAndDelete(id).lean();
    if (!timeslot) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return timeslot;
  }
}
