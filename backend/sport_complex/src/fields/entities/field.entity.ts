import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { FieldStatus } from "../enums/field-status.enum";
import { Sport } from "src/sports/schemas/sport.schemas";
import { SportEntity } from "src/sports/entities/sport.entity";


export class FieldEntity extends MongoEntity {
  capacity: number;

  status: FieldStatus;

  @TransformId((v) => new SportEntity(v))
  type: Types.ObjectId | Sport | null;

  price: number
  
  constructor(partial: Partial<FieldEntity>) {
    super();
    Object.assign(this, partial);
  }
}