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
import { TypeSport } from "./schemas/type-sport.schemas";
import { CreateTypeSportDto } from "./dto/create-type-sport.dto";
import { UpdateTypeSportDto } from "./dto/update-type-sport.dto";

@Injectable()
export class TypeSportsService {
  private readonly errorBuilder = new ErrorBuilder("Type-sports");

  constructor(
    @InjectModel(TypeSport.name)
    private readonly typeSportModel: Model<TypeSport>
  ) {}

  async create(createTypeSportDto: CreateTypeSportDto): Promise<TypeSport> {
    try {
      const typeSportDoc = new this.typeSportModel(createTypeSportDto);
      const typeSport = await typeSportDoc.save();
      return typeSport.toObject();
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

  async findAll(): Promise<TypeSport[]> {
    const typeSport = await this.typeSportModel.find().lean();
    return typeSport;
  }

  async findOne(id: string): Promise<TypeSport> {
    try {
      const typeSport = await this.typeSportModel.findById(id).lean();
      if (!typeSport) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return typeSport;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTypeSportDto: UpdateTypeSportDto
  ): Promise<TypeSport> {
    const exists = await this.typeSportModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const typeSport = await this.typeSportModel
        .findByIdAndUpdate(id, updateTypeSportDto, options)
        .lean();
      return typeSport;
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

  async remove(id: string): Promise<TypeSport> {
    const typeSport = await this.typeSportModel.findByIdAndDelete(id).lean();
    if (!typeSport) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return typeSport;
  }
}