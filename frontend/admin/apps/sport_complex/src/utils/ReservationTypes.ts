import { Field } from "./FieldTypes";
import { Timeslot } from "./TimeSlotTypes";
import { User } from "./UserTypes";

export interface Reservation {
  id?: string;
  user: User
  field: Field
  timeSlot: Timeslot
  type: "pending"|"confirmed"|"cancelled";
  dateTime: string;
}
