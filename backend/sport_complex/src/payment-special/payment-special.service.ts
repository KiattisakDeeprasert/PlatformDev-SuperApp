import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentSpecialDto } from './dto/create-payment-special.dto';
import { UpdatePaymentSpecialDto } from './dto/update-payment-special.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { PaymentSpecial } from './schemas/payment-special.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComplexReservation } from 'src/complex-reservations/schemas/complex-reservation.schemas';
import { SpecialTable } from 'src/special-table/schemas/special-table.schemas';
import { PaymentSpecialStatus } from './enums/payment-special.enum';
import { ComplexReservationStatus } from 'src/complex-reservations/enums/complex-reservation.enum';

const POPULATE_PIPE = [
  {
    path: 'reservation',
    select: ['user', 'name'],
    populate: [
      {
        path: 'user',
        select: ['username'],
      },
      {
        path: 'name',
        select: ['name', 'price'],
        populate: {
          path: 'name',
          select: ['name.en', 'name.th'],
        },
      },
    ],
  },
];
@Injectable()
export class PaymentSpecialService {
  private readonly errorBuilder = new ErrorBuilder('PaymentSpecial');

  constructor(
    @InjectModel(PaymentSpecial.name)
    private readonly paymentSpecialModel: Model<PaymentSpecial>,
    @InjectModel(ComplexReservation.name)
    private readonly complexReservationModel: Model<ComplexReservation>,
    @InjectModel(SpecialTable.name)
    private readonly specialTableModel: Model<SpecialTable>,
  ) {}
  async create(
    createPaymentSpecialDto: CreatePaymentSpecialDto,
  ): Promise<PaymentSpecial> {
    // Ensure the DTO is valid before proceeding
    if (!createPaymentSpecialDto.reservation) {
      throw new BadRequestException(
        'Reservation ID is required to create a payment.',
      );
    }

    try {
      // Default the status to 'pending'
      createPaymentSpecialDto.status = PaymentSpecialStatus.pending;

      // Create the payment document
      const paymentDoc = new this.paymentSpecialModel(createPaymentSpecialDto);
      const payment = await paymentDoc.save();

      // Log the created payment for debugging purposes
      console.log('Payment created successfully:', payment);

      return payment.toObject(); // Convert to plain object if needed
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }

      // Log unexpected errors for debugging
      console.error('Error creating payment:', error);

      throw new InternalServerErrorException(
        'An error occurred while creating the payment.',
      );
    }
  }
  async findPaymentByReservation(
    reservationId: string,
  ): Promise<PaymentSpecial | null> {
    return this.paymentSpecialModel.findOne({ reservation: reservationId });
  }
  async findAll(): Promise<PaymentSpecial[]> {
    const paymentSpecial = await this.paymentSpecialModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return paymentSpecial;
  }

  async findOne(id: string): Promise<PaymentSpecial> {
    try {
      const paymentSpecial = await this.paymentSpecialModel.findById(id).lean();
      if (!paymentSpecial) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return paymentSpecial;
    } catch (error) {
      throw error;
    }
  }
  
  async update(
    id: string,
    updatePaymentSpecialDto: UpdatePaymentSpecialDto,
  ): Promise<PaymentSpecial> {
    const exists = await this.paymentSpecialModel.exists({ _id: id });
    try {
      console.log('Checking if payment exists with ID:', id); // เพิ่ม log เพื่อเช็คว่าเจอ payment หรือไม่
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
  
      const options = { new: true };
  
      console.log('Received DTO for update:', updatePaymentSpecialDto); // เพิ่ม log เพื่อเช็คค่า DTO ที่รับมา
  
      // ตรวจสอบว่ามี paymentImage อยู่ใน DTO เพื่ออัปเดตสถานะการชำระเงินและการจอง
      if (updatePaymentSpecialDto.paymentImage) {
        console.log('Updating payment with paymentImage:', updatePaymentSpecialDto.paymentImage); // เพิ่ม log ก่อนการอัปเดต
        const payment = await this.paymentSpecialModel.findById(id);
        if (!payment) {
          throw new NotFoundException('Payment not found');
        }
  
        // อัปเดต paymentImage และสถานะการชำระเงิน
        payment.paymentImage = updatePaymentSpecialDto.paymentImage;
        payment.status = PaymentSpecialStatus.completed;
  
        console.log('Payment found and updated:', payment); // เพิ่ม log เมื่อ payment ถูกอัปเดตแล้ว
  
        // อัปเดตสถานะการจองเป็น 'confirmed'
        const reservation = await this.complexReservationModel.findById(payment.reservation);
        if (reservation) {
          reservation.status = ComplexReservationStatus.confirmed;
          console.log('Reservation found and updated:', reservation); // เพิ่ม log สำหรับการอัปเดตสถานะการจอง
          await reservation.save();
        }
  
        // บันทึกการเปลี่ยนแปลงของ payment
        return await payment.save();
      } else {
        console.log('No paymentImage found in DTO, performing general update'); // เพิ่ม log กรณีไม่มี paymentImage
        const paymentSpecial = await this.paymentSpecialModel
          .findByIdAndUpdate(id, updatePaymentSpecialDto, options)
          .lean();
        return paymentSpecial;
      }
    } catch (error) {
      console.error('Error during update:', error);
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }
      throw new InternalServerErrorException(
        error.message || 'An unknown error occurred',
      );
    }
  }
  

  async remove(id: string): Promise<PaymentSpecial> {
    const paymentSpecial = await this.paymentSpecialModel
      .findByIdAndDelete(id)
      .lean();
    if (!paymentSpecial) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return paymentSpecial;
  }
}
