import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";
import { FieldTimeSlot } from "./schemas/field-time-slot.schemas";
import { CreateFieldTimeSlotDto } from "./dto/create-field-time-slot.dto";
import { UpdateFieldTimeSlotDto } from "./dto/update-field-time-slot.dto";

const POPULATE_PIPE = [
  {
    path: "field",
    select: ["field", "type","capacity"],
    populate: {
      path: "type",
      select: ["name.en", "name.th"],
    },
  },
  {
    path: "timeSlot",
    select: ["start", "end"],
  },
];

@Injectable()
export class FieldTimeSlotsService {
  private readonly errorBuilder = new ErrorBuilder("FieldTimeSlot");

  constructor(
    @InjectModel(FieldTimeSlot.name)
    private readonly fieldTimeSlotModel: Model<FieldTimeSlot>
  ) {}

  async create(
    createFieldTimeSlotDto: CreateFieldTimeSlotDto
  ): Promise<FieldTimeSlot> {
    try {
      const fieldTimeSlotDoc = new this.fieldTimeSlotModel(createFieldTimeSlotDto);
      const fieldTimeSlot = await fieldTimeSlotDoc.save();
      const populatefieldTimeSlot = await fieldTimeSlot.populate(POPULATE_PIPE)
      return populatefieldTimeSlot.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          })
        );
      }
    }
  }

  async findAll(): Promise<FieldTimeSlot[]> {
    const fieldTimeSlot = await this.fieldTimeSlotModel.find().populate(POPULATE_PIPE).lean();
    return fieldTimeSlot;
  }

  async findOne(id: string): Promise<FieldTimeSlot> {
    try {
      const fieldTimeSlot = await this.fieldTimeSlotModel.findById(id).populate(POPULATE_PIPE).lean();
      if (!fieldTimeSlot) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return fieldTimeSlot;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateFieldTimeSlotDto: UpdateFieldTimeSlotDto
  ): Promise<FieldTimeSlot> {
    const exists = await this.fieldTimeSlotModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const fieldTimeSlot = await this.fieldTimeSlotModel
        .findByIdAndUpdate(id, updateFieldTimeSlotDto, options)
        .populate(POPULATE_PIPE)
        .lean();
      return fieldTimeSlot;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          })
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<FieldTimeSlot> {
    const fieldTimeSlot = await this.fieldTimeSlotModel
      .findByIdAndDelete(id)
      .lean();
    if (!fieldTimeSlot) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return fieldTimeSlot;
  }
}