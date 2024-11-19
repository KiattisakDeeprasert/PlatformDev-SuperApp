export interface FieldTimeSlot {
  id?: string;
  field: {
    id: string;
    capacity: number;
    status: "ready" | "not ready";
    type: { id: string; en: ""; th: "" };
    price: number;
  };
  timeSlot: {
    id: string;
    start: string;
    end: string;
  };
  status: "free" | "reserved" | "in use";
}
