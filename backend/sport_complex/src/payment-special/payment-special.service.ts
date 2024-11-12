import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentSpecialDto } from './dto/create-payment-special.dto';
import { UpdatePaymentSpecialDto } from './dto/update-payment-special.dto';
import { ErrorBuilder, ErrorMethod, RequestAction } from 'src/app/common/utils/error.util';
import { PaymentSpecial } from './schemas/payment-special.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentSpecialService {
  private readonly errorBuilder = new ErrorBuilder("PaymentSpecial");

  constructor(
    @InjectModel(PaymentSpecial.name)
    private readonly paymentSpecialModel: Model<PaymentSpecial>
  ) {}

  async create(createPaymentSpecialDto: CreatePaymentSpecialDto): Promise<PaymentSpecial> {
    try {
      const PaymentSpecialDoc = new this.paymentSpecialModel(createPaymentSpecialDto);
      const paymentSpecial = await PaymentSpecialDoc.save();
      return paymentSpecial.toObject();
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

  async findAll(): Promise<PaymentSpecial[]> {
    const paymentSpecial = await this.paymentSpecialModel.find().lean();
    return paymentSpecial;
  }

  async findOne(id: string): Promise<PaymentSpecial> {
    try {
      const paymentSpecial = await this.paymentSpecialModel.findById(id).lean();
      if (!paymentSpecial) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return paymentSpecial;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updatePaymentSpecialDto: UpdatePaymentSpecialDto
  ): Promise<PaymentSpecial> {
    const exists = await this.paymentSpecialModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const paymentSpecial = await this.paymentSpecialModel
        .findByIdAndUpdate(id, updatePaymentSpecialDto, options)
        .lean();
      return paymentSpecial;
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

  async remove(id: string): Promise<PaymentSpecial> {
    const paymentSpecial = await this.paymentSpecialModel.findByIdAndDelete(id).lean();
    if (!paymentSpecial) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return paymentSpecial;
  }
}
