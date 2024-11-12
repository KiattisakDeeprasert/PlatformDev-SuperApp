import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComplexReservationDto } from './dto/create-complex-reservation.dto';
import { UpdateComplexReservationDto } from './dto/update-complex-reservation.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { ComplexReservation } from './schemas/complex-reservation.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { PaymentSpecialService } from 'src/payment-special/payment-special.service';
import { SpecialTable } from 'src/special-table/schemas/special-table.schemas';
import { ComplexReservationStatus } from './enums/complex-reservation.enum';
import { SpecialTableStatus } from 'src/special-table/enums/special-table.enum';
import { PaymentSpecialStatus } from 'src/payment-special/enums/payment-special.enum';

const POPULATE_PIPE = [
  {
    path: 'name',
    select: ['name', 'price'],
    populate: {
      path: 'name',
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
export class ComplexReservationsService {
  private readonly errorBuilder = new ErrorBuilder('ComplexReservation');

  constructor(
    @InjectModel(ComplexReservation.name)
    private readonly complexReservationModel: Model<ComplexReservation>,
    @InjectModel(SpecialTable.name)
    private readonly specialTableModel: Model<SpecialTable>,
    private readonly paymentSpecialService: PaymentSpecialService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // async create(createComplexReservationDto: CreateComplexReservationDto): Promise<ComplexReservation> {
  //   try {
  //     const ComplexReservationDoc = new this.complexReservationModel(createComplexReservationDto);
  //     const complexReservation = await ComplexReservationDoc.save();
  //     return complexReservation.toObject();
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       throw new ConflictException(
  //         this.errorBuilder.build(ErrorMethod.duplicated, {
  //           action: RequestAction.create,
  //         })
  //       );
  //     }
  //   }
  // }
  async create(
    createComplexReservationDto: CreateComplexReservationDto,
  ): Promise<ComplexReservation> {
    try {
      createComplexReservationDto.status = ComplexReservationStatus.pending;

      // Find the field by ID and ensure it's not null
      const field = await this.specialTableModel.findById(
        createComplexReservationDto.name,
      );
      if (!field) {
        throw new NotFoundException(
          `Field with ID ${createComplexReservationDto.name} not found`,
        );
      }

      // Find the FieldTimeSlot for the given field and timeslot
      const SpecialTable = await this.specialTableModel.findOne({
        name: createComplexReservationDto.name,
        timeSlot: createComplexReservationDto.timeSlot,
      });

      if (!SpecialTable) {
        throw new NotFoundException(
          `SpecialTable for this field and timeslot not found`,
        );
      }

      // If the FieldTimeSlot status is 'free', skip the conflict check
      if (SpecialTable.status === SpecialTableStatus.free) {
        // Proceed with the reservation creation logic without checking capacity
      } else {
        // Count current reservations for the given field and timeslot
        const currentReservationsCount =
          await this.complexReservationModel.countDocuments({
            name: createComplexReservationDto.name,
            timeSlot: createComplexReservationDto.timeSlot,
            type: { $ne: ComplexReservationStatus.cancelled }, // Exclude cancelled reservations
          });

        if (currentReservationsCount >= (field as SpecialTable).capacity) {
          throw new ConflictException(
            `Field is fully booked for the selected timeslot`,
          );
        }
      }

      // Find the user by username
      const user = await this.userModel.findOne({
        username: createComplexReservationDto.user,
      });
      if (!user) {
        throw new NotFoundException(
          `User with username ${createComplexReservationDto.user} not found`,
        );
      }
      createComplexReservationDto.user = user._id; // Convert user ID to ObjectId if necessary

      // Create the reservation document
      const reservationDoc = new this.complexReservationModel(
        createComplexReservationDto,
      );
      const reservation = await reservationDoc.save();

      // Create payment related to the reservation
      const createPaymentDto = {
        reservation: reservation.id,
        paymentImage: null,
        status: PaymentSpecialStatus.pending,
        dateTime: new Date(),
      };
      const payment = await this.paymentSpecialService.create(createPaymentDto);

      // Set timeout to automatically cancel the reservation if payment is not completed within 30 minutes
      setTimeout(
        async () => {
          try {
            const existingPayment = await this.paymentSpecialService.findOne(
              payment._id,
            );
            if (
              existingPayment &&
              existingPayment.status === PaymentSpecialStatus.pending
            ) {
              // Update payment and reservation statuses to cancelled
              await this.paymentSpecialService.update(payment._id, {
                status: PaymentSpecialStatus.cancelled,
              });
              const reservationToCancel =
                await this.complexReservationModel.findById(reservation.id);
              if (reservationToCancel) {
                reservationToCancel.status = ComplexReservationStatus.cancelled;
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

  async findAll(): Promise<ComplexReservation[]> {
    const complexReservation = await this.complexReservationModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return complexReservation;
  }

  async findOne(id: string): Promise<ComplexReservation> {
    try {
      const complexReservation = await this.complexReservationModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!complexReservation) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return complexReservation;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateComplexReservationDto: UpdateComplexReservationDto,
  ): Promise<ComplexReservation> {
    const exists = await this.complexReservationModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const complexReservation = await this.complexReservationModel
        .findByIdAndUpdate(id, updateComplexReservationDto, options)
        .lean();
      return complexReservation;
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

  async remove(id: string): Promise<ComplexReservation> {
    const complexReservation = await this.complexReservationModel
      .findByIdAndDelete(id)
      .populate(POPULATE_PIPE)
      .lean();
    if (!complexReservation) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return complexReservation;
  }
}
