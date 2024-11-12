import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class SpecialFieldEntity extends MongoEntity {
  name: { th: string; en: string };
  price: number
  @TransformUrl({ type: 'string' })
  specialfieldImage: string;
  constructor(partial: Partial<SpecialFieldEntity>) {
    super();
    Object.assign(this, partial);
  }
}
