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
import { PaymentSpecialStatus } from 'src/payment-special/enums/payment-special.enum';
import { SpecialField } from 'src/special-field/schemas/special-field.schemas';
import { SpecialTableService } from 'src/special-table/special-table.service';
import { Timeslot } from 'src/time-slots/schemas/time-slots.schema';

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
    @InjectModel(SpecialField.name)
    private readonly timeslotModel: Model<Timeslot>,
  ) {}
  // Helper function to check if timeSlot is populated with start and end properties
  private isTimeslotPopulated(timeSlot: any): timeSlot is Timeslot {
    return (
      timeSlot &&
      typeof timeSlot.start === 'string' &&
      typeof timeSlot.end === 'string'
    );
  }

  
  // async create(
  //   createComplexReservationDto: CreateComplexReservationDto,
  // ): Promise<ComplexReservation> {
  //   try {
  //     // Set the reservation status to pending initially
  //     createComplexReservationDto.status = ComplexReservationStatus.pending;
  
  //     // Check for field availability
  //     const field = await this.specialFieldModel.findById(
  //       createComplexReservationDto.name,
  //     );
  //     if (!field) {
  //       throw new NotFoundException(
  //         `Field with ID ${createComplexReservationDto.name} not found`,
  //       );
  //     }
  
  //     // Check if the timeslot is available in the special table
  //     const specialTable = await this.specialTableModel.findOne({
  //       name: createComplexReservationDto.name,
  //       timeSlot: createComplexReservationDto.timeSlot,
  //     });
  //     if (!specialTable) {
  //       throw new NotFoundException(
  //         `SpecialTable for this field and timeslot not found`,
  //       );
  //     }
  
  //     // Find the user by username
  //     const user = await this.userModel.findOne({
  //       username: createComplexReservationDto.user,
  //     });
  //     if (!user) {
  //       throw new NotFoundException(
  //         `User with username ${createComplexReservationDto.user} not found`,
  //       );
  //     }
  
  //     // Set user ID in the reservation data
  //     createComplexReservationDto.user = user._id;
  
  //     // Save the reservation in pending state
  //     const reservationDoc = new this.complexReservationModel(
  //       createComplexReservationDto,
  //     );
  //     const reservation = await reservationDoc.save();
  
  //     // Try to create payment associated with the reservation
  //     try {
  //       const createPaymentDto = {
  //         reservation: reservation._id,
  //         paymentImage: null, // Initially, no payment image
  //         status: PaymentSpecialStatus.pending,
  //         dateTime: new Date(),
  //       };
  //       await this.paymentSpecialService.create(createPaymentDto);
  //     } catch (paymentError) {
  //       // If payment creation fails, update reservation status to cancelled
  //       reservation.status = ComplexReservationStatus.cancelled;
  //       await reservation.save();
  //       console.error(
  //         'Payment creation failed, reservation cancelled:',
  //         paymentError,
  //       );
  //       throw new InternalServerErrorException(
  //         'Payment creation failed, reservation cancelled',
  //       );
  //     }
  
  //     // Fetch the full timeslot document to access the `end` time
  //     const timeslot = await this.timeslotModel.findById(createComplexReservationDto.timeSlot);
  //     if (!timeslot || !timeslot.end) {
  //       throw new NotFoundException('Timeslot with valid end time not found');
  //     }
  
  //     // Convert the timeslot end time to a Date object
  //     const endTime = this.convertTimeslotStartToTime(timeslot.end);
  
  //     if (isNaN(endTime.getTime())) {
  //       throw new InternalServerErrorException(
  //         `Invalid timeslot end time format for timeslot ID ${createComplexReservationDto.timeSlot}`
  //       );
  //     }
  
  //     // Schedule reset of user count in SpecialTable after the timeslot ends
  //     await this.specialTableService.resetSpecialTableUserCount(
  //       specialTable.id,
  //       endTime,
  //     );
  
  //     // Return the reservation, which is still in the pending state
  //     return reservation.toObject();
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       throw new ConflictException(
  //         'Duplicate entry detected while creating reservation',
  //       );
  //     }
  //     throw error;
  //   }
  // }
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

  async create(createComplexReservationDto: CreateComplexReservationDto): Promise<ComplexReservation> {
    try {
      createComplexReservationDto.status = ComplexReservationStatus.pending;

      const field = await this.specialFieldModel.findById(createComplexReservationDto.name);
      if (!field) throw new NotFoundException(`Field with ID ${createComplexReservationDto.name} not found`);

      const specialTable = await this.specialTableModel.findOne({
        name: createComplexReservationDto.name,
        timeSlot: createComplexReservationDto.timeSlot,
      });
      if (!specialTable) throw new NotFoundException(`SpecialTable for this field and timeslot not found`);

      const user = await this.userModel.findOne({
        username: createComplexReservationDto.user,
      });
      if (!user) throw new NotFoundException(`User with username ${createComplexReservationDto.user} not found`);

      createComplexReservationDto.user = user._id;

      const reservationDoc = new this.complexReservationModel(createComplexReservationDto);
      const reservation = await reservationDoc.save();

      try {
        const createPaymentDto = {
          reservation: reservation._id,
          paymentImage: null,
          status: PaymentSpecialStatus.pending,
          dateTime: new Date(),
        };
        await this.paymentSpecialService.create(createPaymentDto);
      } catch (paymentError) {
        reservation.status = ComplexReservationStatus.cancelled;
        await reservation.save();
        throw new InternalServerErrorException('Payment creation failed, reservation cancelled');
      }

      return reservation.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate entry detected while creating reservation');
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
