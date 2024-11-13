import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialTableDto } from './dto/create-special-table.dto';
import { UpdateSpecialTableDto } from './dto/update-special-table.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { SpecialTable } from './schemas/special-table.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialTableStatus } from './enums/special-table.enum';

const POPULATE_PIPE = [
  {
    path: 'name',
    select: ['name.th', 'name.en'],
  },
  {
    path: 'timeSlot',
    select: ['start', 'end'],
  },
];

@Injectable()
export class SpecialTableService {
  private readonly errorBuilder = new ErrorBuilder('Special-Table');

  constructor(
    @InjectModel(SpecialTable.name)
    private readonly specialTableModel: Model<SpecialTable>,
  ) {}

  async create(
    createSpecialTableDto: CreateSpecialTableDto,
  ): Promise<SpecialTable> {
    try {
      const specialTableDoc = new this.specialTableModel(createSpecialTableDto);
      const specialTable = await specialTableDoc.save();
      const populateSpecialTable = await specialTable.populate(POPULATE_PIPE);
      return populateSpecialTable.toObject();
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

  async findAll(): Promise<SpecialTable[]> {
    const specialTable = await this.specialTableModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return specialTable;
  }

  async findOne(id: string): Promise<SpecialTable> {
    try {
      const specialTable = await this.specialTableModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!specialTable) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return specialTable;
    } catch (error) {
      throw error;
    }
  }
  async updateSpecialTableUserCount(specialTableId: string): Promise<void> {
    const specialTable = await this.specialTableModel.findById(specialTableId);
    if (!specialTable) {
      throw new NotFoundException('SpecialTable not found');
    }
  
    // Check if there is room for more users
    if (specialTable.userCurrent < specialTable.capacity) {
      specialTable.userCurrent += 1;
  
      // If the table is fully booked, update its status
      if (specialTable.userCurrent === specialTable.capacity) {
        specialTable.status = SpecialTableStatus.full;
      }
  
      // Save the updated special table
      await specialTable.save();
    } else {
      throw new ConflictException('SpecialTable is already full');
    }
  }
  
  async resetSpecialTableUserCount(
    specialTableId: string,
    timeSlotEnd: Date,
  ): Promise<void> {
    const specialTable = await this.specialTableModel.findById(specialTableId);
    if (!specialTable) {
      throw new NotFoundException('SpecialTable not found');
    }

    const delay = timeSlotEnd.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(async () => {
        specialTable.userCurrent = 0;
        specialTable.status = SpecialTableStatus.free;
        await specialTable.save();
      }, delay);
    }
  }

  async update(
    id: string,
    updateSpecialTableDto: UpdateSpecialTableDto,
  ): Promise<SpecialTable> {
    const exists = await this.specialTableModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const specialTable = await this.specialTableModel
        .findByIdAndUpdate(id, updateSpecialTableDto, options)
        .populate(POPULATE_PIPE)
        .lean();
      return specialTable;
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

  async remove(id: string): Promise<SpecialTable> {
    const specialTable = await this.specialTableModel
      .findByIdAndDelete(id)
      .lean();
    if (!specialTable) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return specialTable;
  }
}
