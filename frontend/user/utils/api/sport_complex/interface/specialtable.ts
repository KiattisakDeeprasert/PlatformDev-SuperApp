export interface SpecialTable {
  id?: string;
  field: {
    id?: string;
    name: {
      th: string;
      en: string;
    };
    specialfieldImage: string;
    price: number;
  };
  timeSlot: {
    id?: string;
    start: string;
    end: string;
  };
  capacity: number;
  userCurrent: number;
  status: "free" | "full";
}
