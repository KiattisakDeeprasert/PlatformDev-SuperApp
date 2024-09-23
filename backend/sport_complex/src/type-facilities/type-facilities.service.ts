import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTypeFacilitiesDto } from './dto/create-type-facilitiesdto';
import { UpdateTypeFacilitiesDto } from './dto/update-type-facilities.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeFacilities } from './schemas/type-facilities.schema';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';

@Injectable()
export class TypeFacilitiesService {
  private readonly errorBuilder = new ErrorBuilder('Type-Facilities');

  constructor(
    @InjectModel(TypeFacilities.name)
    private readonly typeFacilitiesModel: Model<TypeFacilities>,
  ) {}

  async create(
    createTypeFacilitiesDto: CreateTypeFacilitiesDto,
  ): Promise<TypeFacilities> {
    try {
      const typeFacilitiesDoc = new this.typeFacilitiesModel(
        createTypeFacilitiesDto,
      );
      const typeFacilities = await typeFacilitiesDoc.save();
      return typeFacilities.toObject();
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

  async findAll(): Promise<TypeFacilities[]> {
    const typeFacilities = await this.typeFacilitiesModel.find().lean();
    return typeFacilities;
  }

  async findOne(id: string): Promise<TypeFacilities> {
    try {
      const typeFacilities = await this.typeFacilitiesModel.findById(id).lean();
      if (!typeFacilities) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return typeFacilities;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTypeFacilitiesDto: UpdateTypeFacilitiesDto,
  ): Promise<TypeFacilities> {
    const exists = await this.typeFacilitiesModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const typeFacilities = await this.typeFacilitiesModel
        .findByIdAndUpdate(id, updateTypeFacilitiesDto, options)
        .lean();
      return typeFacilities;
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

  async remove(id: string): Promise<TypeFacilities> {
    const typeFacilities = await this.typeFacilitiesModel
      .findByIdAndDelete(id)
      .lean();
    if (!typeFacilities) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return typeFacilities;
  }
}
