import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ErrorBuilder, ErrorMethod, RequestAction } from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payments.schemas';
import { Model } from 'mongoose';
import { Reservation } from 'src/reservations/schemas/reservation.schemas';
import { PaymentStatus } from './enums/payment.enum';

const POPULATE_PIPE = [
  {
    path: "reservation",
    select: ["user"],
    populate: {
      path: "user",
      select: ["username"],
    },
  },
];

@Injectable()
export class PaymentsService {
  private readonly errorBuilder = new ErrorBuilder("Payments");

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      // Default the status to 'pending'
      createPaymentDto.status = PaymentStatus.pending;

      const paymentDoc = new this.paymentModel(createPaymentDto);
      const payment = await paymentDoc.save();
      return payment.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }


  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().populate(POPULATE_PIPE).lean();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate(POPULATE_PIPE)
      .lean();
    
    if (!payment) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const exists = await this.paymentModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }

    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    const { status, reservation: reservationId } = updatePaymentDto;

    // Find the reservation
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException("Reservation not found");
    }

    // Handle status change logic
    if (status) {
      if (status === PaymentStatus.completed && payment.status === PaymentStatus.pending) {
        payment.status = PaymentStatus.completed; // Update payment status
      } else if (status === PaymentStatus.cancelled && payment.status === PaymentStatus.pending) {
        payment.status = PaymentStatus.cancelled; // Update payment status to cancelled
      } else {
        throw new BadRequestException("Invalid status transition.");
      }
    }

    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      id,
      { status: payment.status, ...(reservationId && { reservation: reservationId }) },
      { new: true },
    ).lean();

    return updatedPayment;
  }

  async remove(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findByIdAndDelete(id).lean();
    if (!payment) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return payment;
  }
}
