import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservationType } from './enums/reservation.enum';
import { Reservation } from './schemas/reservation.schemas';
import { FieldTimeSlot } from 'src/field-time-slots/schemas/field-time-slot.schemas';
import { FieldTimeSlotStatus } from 'src/field-time-slots/enums/field-time-slot.enum';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentStatus } from 'src/payments/enums/payment.enum';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';
import { User } from 'src/users/schemas/user.schema';

const POPULATE_PIPE = [
  {
    path: 'field',
    select: ['field', 'type', 'price'],
    populate: {
      path: 'type',
      select: ['name.en', 'name.th'],
    },
  },
  {
    path: 'timeSlot',
    select: ['start', 'end'],
  },
  {
    path: 'user',
    select: ['username'],
  },
];

@Injectable()
export class ReservationsService {
  private readonly errorBuilder = new ErrorBuilder('Reservation');

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(FieldTimeSlot.name)
    private readonly fieldTimeSlotModel: Model<FieldTimeSlot>,
    private readonly paymentsService: PaymentsService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // 1. Create reservation with default "pending" status
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      createReservationDto.type = reservationType.pending;

      // Find the user by username
      const user = await this.userModel.findOne({
        username: createReservationDto.user,
      });

      if (!user) {
        throw new NotFoundException(
          `User with username ${createReservationDto.user} not found`,
        );
      }

      // Convert the user ID to ObjectId if necessary
      createReservationDto.user = user._id; // assuming `user._id` is an ObjectId

      // Create & record reservation data
      const reservationDoc = new this.reservationModel(createReservationDto);
      const reservation = await reservationDoc.save();

      // Create payment in relation to reservation
      const createPaymentDto = {
        reservation: reservation.id, // relation payment to booking
        paymentImage: null,
        status: PaymentStatus.pending,
        dateTime: new Date(),
      };

      const payment = await this.paymentsService.create(createPaymentDto);

      // Set a timeout for 30 minutes to cancel the reservation and update payment
      setTimeout(
        async () => {
          try {
            if (!payment._id) {
              console.error('Payment ID is undefined inside setTimeout.');
              return;
            }

            const existingPayment = await this.paymentsService.findOne(
              payment._id,
            );
            if (
              existingPayment &&
              existingPayment.status === PaymentStatus.pending
            ) {
              // Update the payment status to cancelled
              existingPayment.status = PaymentStatus.cancelled;
              await this.paymentsService.update(payment._id, {
                status: PaymentStatus.cancelled,
              });

              // Change the reservation status to cancelled
              const reservationToCancel = await this.reservationModel.findById(
                reservation.id,
              );
              if (reservationToCancel) {
                reservationToCancel.type = reservationType.cancelled;
                await reservationToCancel.save();
              }
            }
          } catch (error) {
            console.error('Error in setTimeout:', error);
          }
        },
        30 * 60 * 1000,
      );

      return reservation.toObject();
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

  // Add other methods like findAll, findOne, update, and remove here...

  // 3 & 4. Update reservation status and FieldTimeSlot accordingly
  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('timeSlot')
      .lean();
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    try {
      const { type } = updateReservationDto;
      const { field, timeSlot } = reservation;

      const populatedTimeSlot = timeSlot as Timeslot;

      // Handle reservation status changes
      if (
        reservation.type === reservationType.pending &&
        type === reservationType.confirmed
      ) {
        const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
          field,
          timeSlot: populatedTimeSlot.id,
        });
        if (fieldTimeSlot.status === FieldTimeSlotStatus.reserved) {
          fieldTimeSlot.status = FieldTimeSlotStatus.in_use;
          await fieldTimeSlot.save();

          const reservationDuration =
            new Date(populatedTimeSlot.end).getTime() - new Date().getTime();

          setTimeout(async () => {
            fieldTimeSlot.status = FieldTimeSlotStatus.free;
            await fieldTimeSlot.save();
            console.log(
              `FieldTimeSlot for field ${field} and timeSlot ${populatedTimeSlot.id} is now free`,
            );
          }, reservationDuration);
        }
      }

      if (
        reservation.type === reservationType.pending &&
        type === reservationType.cancelled
      ) {
        const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
          field,
          timeSlot: populatedTimeSlot.id,
        });
        if (fieldTimeSlot.status === FieldTimeSlotStatus.reserved) {
          fieldTimeSlot.status = FieldTimeSlotStatus.free;
          await fieldTimeSlot.save();
        }
      }

      const updatedReservation = await this.reservationModel
        .findByIdAndUpdate(id, updateReservationDto, { new: true })
        .lean();
      return updatedReservation;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate data error');
      }
      throw error;
    }
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return reservations;
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).lean();
    if (!reservation) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return reservation;
  }

  async remove(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findByIdAndDelete(id)
      .lean();
    if (!reservation) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return reservation;
  }
}
