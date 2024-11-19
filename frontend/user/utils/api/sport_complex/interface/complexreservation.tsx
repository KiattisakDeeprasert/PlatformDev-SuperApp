export interface SpecialReservation {
  id: string;
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
  user: {
    _id: string;
    email: string;
    password: string;
    username: string;
  };
}
