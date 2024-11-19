export interface Field {
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
}
