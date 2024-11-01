import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    // Ensure the DTO is valid before proceeding
    if (!createPaymentDto.reservation) {
      throw new BadRequestException('Reservation ID is required to create a payment.');
    }
  
    try {
      // Default the status to 'pending'
      createPaymentDto.status = PaymentStatus.pending;
  
      // Create the payment document
      const paymentDoc = new this.paymentModel(createPaymentDto);
      const payment = await paymentDoc.save();
  
      // Log the created payment for debugging purposes
      console.log("Payment created successfully:", payment);
  
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
      console.error("Error creating payment:", error);
  
      throw new InternalServerErrorException('An error occurred while creating the payment.');
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

    // อัปเดตรูปภาพการชำระเงิน
    if (paymentImage) {
      payment.paymentImage = paymentImage;
      payment.status = PaymentStatus.completed; // เปลี่ยนสถานะเป็น completed
      await payment.save(); // บันทึกการเปลี่ยนแปลงสถานะ
    }

    // อัปเดตการจอง
    if (reservationId) {
      const reservation = await this.reservationModel.findById(reservationId);
      if (!reservation) {
        throw new NotFoundException("Reservation not found");
      }
      reservation.type = reservationType.confirmed;
      await reservation.save(); // บันทึกการเปลี่ยนแปลงการจอง

      // อัปเดตสถานะของ FieldTimeSlot
      const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
        field: reservation.field,
        timeSlot: reservation.timeSlot,
      });

      if (fieldTimeSlot && fieldTimeSlot.status === FieldTimeSlotStatus.free) {
        fieldTimeSlot.status = FieldTimeSlotStatus.reserved;
        await fieldTimeSlot.save();
      }
    }

    return await this.paymentModel.findById(id).lean();
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
