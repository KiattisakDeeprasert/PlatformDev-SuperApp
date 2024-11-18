import { SpecialField } from "./SpecialFieldTypes";
import { Timeslot } from "./TimeSlotTypes";
import { User } from "./UserTypes";

export interface SpecialReservation {
  id: string;
  field: SpecialField;
  timeSlot: Timeslot;
  user:User;
  status: "pending"|"confirmed"|"cancelled";
  dateTime: string;
}
