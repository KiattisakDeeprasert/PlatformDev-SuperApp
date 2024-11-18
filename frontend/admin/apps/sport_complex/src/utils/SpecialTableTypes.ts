import { SpecialField } from "./SpecialFieldTypes";
import { Timeslot } from "./TimeSlotTypes";

export interface SpecialTable {
  id?: string;
  field: SpecialField;
  timeSlot: Timeslot;
  capacity: number;
  userCurrent: number;
  status: "free" | "full";
}
