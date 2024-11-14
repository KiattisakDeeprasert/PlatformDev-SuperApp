import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformUrl } from "src/app/decorator/transform-url.decorator";
export class SportEntity extends MongoEntity {
  name: { th: string; en: string };
  @TransformUrl({ type: 'string' })
  sportImage: string;
  constructor(partial: Partial<SportEntity>) {
    super();
    Object.assign(this, partial);
  }
}

