import { SpecialReservation } from "./SpecialReservationTypes";

export interface PaymentSpecial {
  id: string;
  reservation: SpecialReservation;
  status: "pending" | "completed" | "cancelled";
  paymentImage: string;
  dateTime: string;
}
