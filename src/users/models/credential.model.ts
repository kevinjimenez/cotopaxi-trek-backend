import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';

@ObjectType()
export class Credential extends BaseModel {
  @Field(() => Int)
  id: number;

  // @Field()
  password: string; // sin @Field() -> no aparece en el schema, no se puede consultar
}
