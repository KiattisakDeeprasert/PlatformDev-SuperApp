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
import { SpecialTableService } from 'src/special-table/special-table.service';
import { SpecialTableStatus } from 'src/special-table/enums/special-table.enum';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';

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
    private readonly specialTableService: SpecialTableService,
  ) {}
  private convertTimeslotStartToTime(start: string): Date {
    const [hoursStr, minutesStr] = start.split(':').map((str) => str.trim());
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      console.error(`Invalid timeslot start string: ${start}`);
      return new Date(NaN);
    }

    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
  }
  private isTimeslotPopulated(timeSlot: any): timeSlot is Timeslot {
    return (
      timeSlot &&
      typeof timeSlot.start === 'string' &&
      typeof timeSlot.end === 'string'
    );
  }
  private convertTimeslotEndToTime(end: string): Date {
    const [hoursStr, minutesStr] = end.split(':').map((str) => str.trim());
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      console.error(`Invalid timeslot end string: ${end}`);
      return new Date(NaN);
    }

    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
  }
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
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
  
      const options = { new: true };
  
      if (updatePaymentSpecialDto.paymentImage) {
        console.log('Updating payment with paymentImage:', updatePaymentSpecialDto.paymentImage);
  
        // Find the payment and update its status
        const payment = await this.paymentSpecialModel.findById(id);
        if (!payment) {
          throw new NotFoundException('Payment not found');
        }
  
        // Update payment status to completed and save the payment image
        payment.paymentImage = updatePaymentSpecialDto.paymentImage;
        payment.status = PaymentSpecialStatus.completed;
  
        // Find the associated reservation
        const reservation = await this.complexReservationModel.findById(payment.reservation);
        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }
  
        // Set reservation status to confirmed
        reservation.status = ComplexReservationStatus.confirmed;
        console.log('Reservation found and updated:', reservation);
        await reservation.save();
  
        // Find the associated SpecialTable
        const specialTable = await this.specialTableModel.findOne({
          name: reservation.name,
          timeSlot: reservation.timeSlot,
        });
  
        if (!specialTable) {
          throw new NotFoundException('SpecialTable not found');
        }
  
        // Update user count in SpecialTable
        await this.specialTableService.updateSpecialTableUserCount(specialTable.id);
  
        // Save the updated payment
        await payment.save();
        return payment.toObject();
      } else {
        console.log('No paymentImage found in DTO, performing general update');
        
        // If no paymentImage, just perform a regular update
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
