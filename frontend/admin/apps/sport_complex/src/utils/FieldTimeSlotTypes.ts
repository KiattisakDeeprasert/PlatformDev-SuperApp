import { Field } from "./FieldTypes";
import { Timeslot } from "./TimeSlotTypes";


export interface FieldTimeSlot {
  id?: string;
  field: Field;
  timeSlot: Timeslot;
  status: "free" | "reserve" |"in use";
}
