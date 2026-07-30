// src/common/base/base.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
