import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialFieldDto } from './dto/create-special-field.dto';
import { UpdateSpecialFieldDto } from './dto/update-special-field.dto';
import { ErrorBuilder, ErrorMethod, RequestAction } from 'src/app/common/utils/error.util';
import { SpecialField } from './schemas/special-field.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SpecialFieldService {
  private readonly errorBuilder = new ErrorBuilder("SpecialField");

  constructor(
    @InjectModel(SpecialField.name)
    private readonly specialFieldModel: Model<SpecialField>
  ) {}

  async create(createSpecialFieldDto: CreateSpecialFieldDto): Promise<SpecialField> {
    try {
      const SpecialFieldDoc = new this.specialFieldModel(createSpecialFieldDto);
      const specialField = await SpecialFieldDoc.save();
      return specialField.toObject();
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

  async findAll(): Promise<SpecialField[]> {
    const specialField = await this.specialFieldModel.find().lean();
    return specialField;
  }

  async findOne(id: string): Promise<SpecialField> {
    try {
      const specialField = await this.specialFieldModel.findById(id).lean();
      if (!specialField) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return specialField;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSpecialFieldDto: UpdateSpecialFieldDto
  ): Promise<SpecialField> {
    const exists = await this.specialFieldModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const specialField = await this.specialFieldModel
        .findByIdAndUpdate(id, UpdateSpecialFieldDto, options)
        .lean();
      return specialField;
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

  async remove(id: string): Promise<SpecialField> {
    const specialField = await this.specialFieldModel.findByIdAndDelete(id).lean();
    if (!specialField) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return specialField;
  }
}
