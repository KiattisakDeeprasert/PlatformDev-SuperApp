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
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { Field } from "./schemas/fields.schemas";


const POPULATE_PIPE = [
  {
    path: "type",
    select: ["name.th", "name.en"],
  },
]

@Injectable()

export class FieldsService {  
  private readonly errorBuilder = new ErrorBuilder("Fields");

  constructor(
    @InjectModel(Field.name)
    private readonly fieldModel: Model<Field>
  ) {}

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    try {
      const fieldDoc = new this.fieldModel(createFieldDto);
      const field = await fieldDoc.save();
      return field.toObject();
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

  async findAll(): Promise<Field[]> {
    const field = await this.fieldModel.find().populate(POPULATE_PIPE).lean();
    return field;
  }

  async findOne(id: string): Promise<Field> {
    try {
      const field = await this.fieldModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!field) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return field;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<Field> {
    const exists = await this.fieldModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const field = await this.fieldModel
        .findByIdAndUpdate(id, updateFieldDto, options)
        .lean();
      return field;
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

  async remove(id: string): Promise<Field> {
    const field = await this.fieldModel.findByIdAndDelete(id).lean();
    if (!field) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return field;
  }
}