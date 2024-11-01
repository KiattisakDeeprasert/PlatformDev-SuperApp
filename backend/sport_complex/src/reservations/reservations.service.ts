import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { reservationType } from "./enums/reservation.enum";
import { Reservation } from "./schemas/reservation.schemas";
import { FieldTimeSlot } from "src/field-time-slots/schemas/field-time-slot.schemas";
import { FieldTimeSlotStatus } from "src/field-time-slots/enums/field-time-slot.enum";
import { PaymentsService } from "src/payments/payments.service";
import { PaymentStatus } from "src/payments/enums/payment.enum";

const POPULATE_PIPE = [
  {
    path: "field",
    select: ["field", "type","price"],
    populate: {
      path: "type",
      select: ["name.en", "name.th"],
    },
  },
  {
    path: "timeSlot",
    select: ["start", "end"],
  },
  {
    path: "user",
    select: ["username"]
  }
];

@Injectable()
export class ReservationsService {
  private readonly errorBuilder = new ErrorBuilder("Reservation");

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(FieldTimeSlot.name)
    private readonly fieldTimeSlotModel: Model<FieldTimeSlot>,
    private readonly paymentsService: PaymentsService
  ) {}

  // 1. Create reservation with default "pending" status
  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    try {
      // set type reservation is "pending" default
      createReservationDto.type = reservationType.pending;
  
      // create & record reservation data
      const reservationDoc = new this.reservationModel(createReservationDto);
      const reservation = await reservationDoc.save();
  
      // create payment in relation reservation
      const createPaymentDto = {
        reservation: reservation.id, // relation payment to reservation
        paymentImage: null,
        status: PaymentStatus.pending,
        dateTime: new Date(),
      };
  
      await this.paymentsService.create(createPaymentDto);
  
      return reservation.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          })
        );
      }
      throw error;
    }
  }
  

  // Add other methods like findAll, findOne, update, and remove here...

  // 3 & 4. Update reservation status and FieldTimeSlot accordingly
  async update(
    id: string,
    updateReservationDto: UpdateReservationDto
  ): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    try {
      const { type } = updateReservationDto;
      const { field, timeSlot } = reservation;

      // Handle status change to "confirmed"
      if (
        reservation.type === reservationType.pending &&
        type === reservationType.confirmed
      ) {
        const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
          field,
          timeSlot,
        });
        if (fieldTimeSlot.status === FieldTimeSlotStatus.reserved) {
          fieldTimeSlot.status = FieldTimeSlotStatus.in_use;
          await fieldTimeSlot.save();

          // Start a countdown of 1 hour to set FieldTimeSlot back to "free"
          setTimeout(
            async () => {
              fieldTimeSlot.status = FieldTimeSlotStatus.free;
              await fieldTimeSlot.save();
              console.log(
                `FieldTimeSlot for field ${field} and timeSlot ${timeSlot} is now free`
              );
            },
            1 * 60 * 1000 // 1 hour in milliseconds
          );
        }
      }

      // Handle status change to "cancelled"
      if (
        reservation.type === reservationType.pending &&
        type === reservationType.cancelled
      ) {
        const fieldTimeSlot = await this.fieldTimeSlotModel.findOne({
          field,
          timeSlot,
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
        throw new ConflictException("Duplicate data error");
      }
      throw error;
    }
  }
  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationModel.find().populate(POPULATE_PIPE).lean();
    return reservations;
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).lean();
    if (!reservation) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
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
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return reservation;
  }
}
