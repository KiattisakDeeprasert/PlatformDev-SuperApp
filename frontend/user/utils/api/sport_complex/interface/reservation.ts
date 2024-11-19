export interface Reservation {
  id: string;
  user: {
    _id: string;
    email: string;
    password: string;
    username: string;
  };
  field: {
    id: string;
    capacity: number;
    status: "ready" | "not ready";
    type: {
      id: string;
      name: {
        en: string;
        th: string;
      };
    };
    price: number;
  };
}
