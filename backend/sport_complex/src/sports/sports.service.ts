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
import { Sport } from "./schemas/sport.schemas";
import { CreateSportDto } from "./dto/create-sport.dto";
import { UpdateSportDto } from "./dto/update-sport.dto";

@Injectable()
export class SportsService {
  private readonly errorBuilder = new ErrorBuilder("Sport");

  constructor(
    @InjectModel(Sport.name)
    private readonly sportModel: Model<Sport>
  ) {}

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    try {
      const SportDoc = new this.sportModel(createSportDto);
      const sport = await SportDoc.save();
      return sport.toObject();
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

  async findAll(): Promise<Sport[]> {
    const sport = await this.sportModel.find().lean();
    return sport;
  }

  async findOne(id: string): Promise<Sport> {
    try {
      const sport = await this.sportModel.findById(id).lean();
      if (!sport) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return sport;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSportDto: UpdateSportDto
  ): Promise<Sport> {
    const exists = await this.sportModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const sport = await this.sportModel
        .findByIdAndUpdate(id, updateSportDto, options)
        .lean();
      return sport;
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

  async remove(id: string): Promise<Sport> {
    const sport = await this.sportModel.findByIdAndDelete(id).lean();
    if (!sport) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return sport;
  }
}