import { MongoEntity } from "src/app/common/lib/mongo.entiy";
export class SportEntity extends MongoEntity {
  name: { th: string; en: string };

  constructor(partial: Partial<SportEntity>) {
    super();
    Object.assign(this, partial);
  }
}

