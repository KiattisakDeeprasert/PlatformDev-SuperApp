import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ErrorBuilder, ErrorMethod, RequestAction } from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payments.schemas';
import { Model } from 'mongoose';
import { Reservation } from 'src/reservations/schemas/reservation.schemas';
import { PaymentStatus } from './enums/payment.enum';
import { reservationType } from 'src/reservations/enums/reservation.enum';
import { FieldTimeSlotStatus } from 'src/field-time-slots/enums/field-time-slot.enum';
import { FieldTimeSlot } from 'src/field-time-slots/schemas/field-time-slot.schemas';

const POPULATE_PIPE = [
  {
    path: "reservation",
    select: ["user", "field"],
    populate: [
      {
        path: "user",
        select: ["username"],
      },
      {
        path: "field",
        select: ["price"], 
      },
    ],
  },
];

@Injectable()
export class PaymentsService {
  private readonly errorBuilder = new ErrorBuilder("Payments");

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(FieldTimeSlot.name)
    private readonly fieldTimeSlotModel: Model<FieldTimeSlot>,
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
  
    const { paymentImage, reservation: reservationId } = updatePaymentDto;
  
    // check attach paymentImage
    if (paymentImage) {
      // update status payment "completed"
      payment.status = PaymentStatus.completed;
      payment.paymentImage = paymentImage;
      await payment.save();
  
      // find reservation
      const reservation = await this.reservationModel.findById(reservationId);
      if (!reservation) {
        throw new NotFoundException("Reservation not found");
      }
  
      // update status reservation "confirmed"
      reservation.type = reservationType.confirmed;
      await reservation.save();
  
      // update status FieldTimeSlot is "reserved"
      const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
        field: reservation.field,
        timeSlot: reservation.timeSlot,
      });
  
      if (fieldTimeSlot && fieldTimeSlot.status === FieldTimeSlotStatus.free) {
        fieldTimeSlot.status = FieldTimeSlotStatus.reserved;
        await fieldTimeSlot.save();
      }
    } else {
      throw new BadRequestException("Payment image is required for completion.");
    }
  
    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      id,
      { status: payment.status, paymentImage: payment.paymentImage },
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
