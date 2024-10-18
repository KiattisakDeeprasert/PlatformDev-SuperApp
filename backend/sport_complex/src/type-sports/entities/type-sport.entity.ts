import { MongoEntity } from "src/app/common/lib/mongo.entiy";
export class TypeSportEntity extends MongoEntity {
  name: { th: string; en: string };

  constructor(partial: Partial<TypeSportEntity>) {
    super();
    Object.assign(this, partial);
  }
}

