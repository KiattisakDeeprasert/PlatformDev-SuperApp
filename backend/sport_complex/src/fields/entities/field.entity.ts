import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { TypeSportEntity } from "src/type-sports/entities/type-sport.entity";
import { TypeSport } from "src/type-sports/schemas/type-sport.schemas";
import { FieldStatus } from "../enums/field-status.enum";


export class FieldEntity extends MongoEntity {
  capacity: number;

  status: FieldStatus;

  @TransformId((v) => new TypeSportEntity(v))
  type: Types.ObjectId | TypeSport | null;

  constructor(partial: Partial<FieldEntity>) {
    super();
    Object.assign(this, partial);
  }
}