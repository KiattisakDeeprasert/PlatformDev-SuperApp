import { forwardRef, Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "./schemas/reservation.schemas";
import { FieldsModule } from "src/fields/fields.module";
import { FieldTimeSlotsModule } from "src/field-time-slots/field-time-slots.module";
import { PaymentsModule } from "src/payments/payments.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    forwardRef(() => FieldsModule),
    forwardRef(() => FieldTimeSlotsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentsModule)
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [MongooseModule],
})
export class ReservationsModule {}