import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payments.schemas';
import { Model } from 'mongoose';
import { Reservation } from 'src/reservations/schemas/reservation.schemas';
import { PaymentStatus } from './enums/payment.enum';
import { reservationType } from 'src/reservations/enums/reservation.enum';
import { FieldTimeSlotStatus } from 'src/field-time-slots/enums/field-time-slot.enum';
import { FieldTimeSlot } from 'src/field-time-slots/schemas/field-time-slot.schemas';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';

const POPULATE_PIPE = [
  {
    path: 'reservation',
    select: ['user', 'field'],
    populate: [
      {
        path: 'user',
        select: ['username'],
      },
      {
        path: 'field',
        select: ['price'],
      },
    ],
  },
];

@Injectable()
export class PaymentsService {
  private readonly errorBuilder = new ErrorBuilder('Payments');

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(FieldTimeSlot.name)
    private readonly fieldTimeSlotModel: Model<FieldTimeSlot>,
  ) {}
  private async scheduleTimeout(
    reservationId: string,
    field: string,
    timeSlot: string,
    duration: number,
  ) {
    const delay = duration; // Duration already in milliseconds

    if (delay > 0) {
      setTimeout(async () => {
        console.log('Timeout triggered for freeing field time slot.');
        try {
          const reservation =
            await this.reservationModel.findById(reservationId);
          if (reservation && reservation.type === reservationType.confirmed) {
            const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
              field,
              timeSlot,
            });
            if (
              fieldTimeSlot &&
              fieldTimeSlot.status === FieldTimeSlotStatus.in_use
            ) {
              fieldTimeSlot.status = FieldTimeSlotStatus.free;
              await fieldTimeSlot.save();
              console.log(
                `FieldTimeSlot for field ${field} and timeSlot ${timeSlot} is now free.`,
              );
            }
          }
        } catch (error) {
          console.error('Error during timeout execution:', error);
        }
      }, delay);
    } else {
      console.log('Delay is not positive, timeout will not be set.');
    }
  }

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
      return new Date(NaN); // Return an invalid date
    }

    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Ensure the DTO is valid before proceeding
    if (!createPaymentDto.reservation) {
      throw new BadRequestException(
        'Reservation ID is required to create a payment.',
      );
    }

    try {
      // Default the status to 'pending'
      createPaymentDto.status = PaymentStatus.pending;

      // Create the payment document
      const paymentDoc = new this.paymentModel(createPaymentDto);
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
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const exists = await this.paymentModel.exists({ _id: id });
  
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
  
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
  
    const { paymentImage, reservation: reservationId } = updatePaymentDto;
  
    if (paymentImage) {
      payment.paymentImage = paymentImage;
      payment.status = PaymentStatus.completed; // Change status to completed
      await payment.save(); // Save payment changes
  
      // Handle reservation update
      if (reservationId) {
        const reservation = await this.reservationModel
          .findById(reservationId)
          .populate('timeSlot'); // Ensure timeSlot is populated
  
        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }
  
        reservation.type = reservationType.confirmed;
        await reservation.save();
  
        const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
          field: reservation.field,
          timeSlot: reservation.timeSlot,
        });
  
        if (fieldTimeSlot) {
          fieldTimeSlot.status = FieldTimeSlotStatus.reserved;
          await fieldTimeSlot.save();
  
          // Check if timeSlot is populated with start and end properties
          if (this.isTimeslotPopulated(reservation.timeSlot)) {
            const startTime = this.convertTimeslotStartToTime(reservation.timeSlot.start);
            const endTime = this.convertTimeslotStartToTime(reservation.timeSlot.end);
            const now = new Date();
  
            if (startTime && endTime) {
              // Set timeout to change status to in_use at start time
              const startDelay = startTime.getTime() - now.getTime();
              if (startDelay > 0) {
                setTimeout(async () => {
                  try {
                    fieldTimeSlot.status = FieldTimeSlotStatus.in_use;
                    await fieldTimeSlot.save();
                    console.log(`FieldTimeSlot for field ${reservation.field} is now in use.`);
                  } catch (error) {
                    console.error('Error setting field time slot to in_use:', error);
                  }
                }, startDelay);
              }
  
              // Set timeout to change status to free at end time
              const endDelay = endTime.getTime() - now.getTime();
              if (endDelay > 0) {
                setTimeout(async () => {
                  try {
                    fieldTimeSlot.status = FieldTimeSlotStatus.free;
                    await fieldTimeSlot.save();
                    console.log(`FieldTimeSlot for field is now free.`);
                  } catch (error) {
                    console.error('Error setting field time slot to free:', error);
                  }
                }, endDelay);
              }
            } else {
              console.error('Invalid start or end time for timeslot.');
            }
          } else {
            console.error('timeSlot is not populated as Timeslot.');
          }
        }
      }
    }
  
    return await this.paymentModel.findById(id).lean();
  }
  
  // Helper function to check if timeSlot is populated with start and end properties
  private isTimeslotPopulated(timeSlot: any): timeSlot is Timeslot {
    return timeSlot && typeof timeSlot.start === 'string' && typeof timeSlot.end === 'string';
  }
  
  
  

  async remove(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findByIdAndDelete(id).lean();
    if (!payment) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return payment;
  }
}
