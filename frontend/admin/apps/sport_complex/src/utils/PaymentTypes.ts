export interface Payment {
  id: string;
  reservation: {
    id: string;
    user: { username: string };
    field: { price: number };
  };
  status: "pending" | "completed" | "cancelled";
  paymentImage: string;
  dateTime: string;
}
