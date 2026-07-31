import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { User } from './user.model';

@ObjectType()
export class UserCredential extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field()
  userId: string;

  // @Field()
  password: string; // sin @Field() -> no aparece en el schema, no se puede consultar

  @Field(() => User, { nullable: true })
  user?: User;
}
