import { Type } from "./Types";

export interface Field {
  id?: string;
  capacity: number;
  status: "ready" | "not ready";
  type: Type
  price: number;
}
