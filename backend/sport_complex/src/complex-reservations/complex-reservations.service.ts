import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';
import { SpecialTableService } from 'src/special-table/special-table.service';

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
    private readonly specialTableService: SpecialTableService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(SpecialField.name)
    private readonly specialFieldModel: Model<SpecialField>,
  ) {}

  async create(
    createComplexReservationDto: CreateComplexReservationDto,
  ): Promise<ComplexReservation> {
    try {
      // Set the reservation status to pending initially
      createComplexReservationDto.status = ComplexReservationStatus.pending;

      // Check for field availability
      const field = await this.specialFieldModel.findById(
        createComplexReservationDto.name,
      );
      if (!field) {
        throw new NotFoundException(
          `Field with ID ${createComplexReservationDto.name} not found`,
        );
      }

      // Check if the timeslot is available in the special table
      const specialTable = await this.specialTableModel.findOne({
        name: createComplexReservationDto.name,
        timeSlot: createComplexReservationDto.timeSlot,
      });
      if (!specialTable) {
        throw new NotFoundException(
          `SpecialTable for this field and timeslot not found`,
        );
      }
      console.log('name in DTO:', createComplexReservationDto.name);//delete ออกด้วย
      console.log('timeSlot in DTO:', createComplexReservationDto.timeSlot);//delete ออกด้วย
      const specialTables = await this.specialTableModel.find({});//delete ออกด้วย
      console.log('All SpecialTables:', specialTables);//delete ออกด้วย

      // Find the user by username
      const user = await this.userModel.findOne({
        username: createComplexReservationDto.user,
      });
      if (!user) {
        throw new NotFoundException(
          `User with username ${createComplexReservationDto.user} not found`,
        );
      }

      // Set user ID in the reservation data
      createComplexReservationDto.user = user._id;

      // Save the reservation
      const reservationDoc = new this.complexReservationModel(
        createComplexReservationDto,
      );
      const reservation = await reservationDoc.save();

      try {
        // Create payment associated with the reservation
        const createPaymentDto = {
          reservation: reservation._id,
          paymentImage: null,
          status: PaymentSpecialStatus.pending,
          dateTime: new Date(),
        };
        await this.paymentSpecialService.create(createPaymentDto);
      } catch (paymentError) {
        // If payment creation fails, update reservation status to cancelled
        reservation.status = ComplexReservationStatus.cancelled;
        await reservation.save();
        console.error(
          'Payment creation failed, reservation cancelled:',
          paymentError,
        );
        throw new InternalServerErrorException(
          'Payment creation failed, reservation cancelled',
        );
      }

      // Update user count in SpecialTable
      if (reservation.status === ComplexReservationStatus.confirmed) {
        // Update user count in SpecialTable for the corresponding field and timeslot
        await this.specialTableService.updateSpecialTableUserCount(
          reservation.name.toString(),
        );
      }

      // Reset SpecialTable user count after the timeslot ends
      if (reservation.timeSlot && 'end' in reservation.timeSlot) {
        await this.specialTableService.resetSpecialTableUserCount(
          reservation.name.toString(),
          new Date(reservation.timeSlot.end),
        );
      }

      // Set a timeout for automatic cancellation if payment is not completed within 30 minutes
      setTimeout(
        async () => {
          try {
            // Find the payment by filtering on the `reservation` field
            const existingPayment =
              await this.paymentSpecialService.findPaymentByReservation(
                reservation.id,
              );

            if (
              existingPayment &&
              existingPayment.status === PaymentSpecialStatus.pending
            ) {
              // Update payment and reservation status to cancelled
              await this.paymentSpecialService.update(existingPayment._id, {
                status: PaymentSpecialStatus.cancelled,
              });
              reservation.status = ComplexReservationStatus.cancelled;
              await reservation.save();
            }
          } catch (error) {
            console.error(
              'Error in setTimeout for reservation cancellation:',
              error,
            );
          }
        },
        30 * 60 * 1000,
      );

      return reservation.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Duplicate entry detected while creating reservation',
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
