import { Type } from "./Types";

export interface Reservation {
  id: string;
  user: {
    id: string;
    username: string;
  };
  field: {
    id: string;
    type: Type;
    price: number;
  };
  timeSlot: {
    id: string;
    start: string;
    end: string;
  };
  type: "pending"|"confirmed"|"cancelled";
  dateTime: string;
}
