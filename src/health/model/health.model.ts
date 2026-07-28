import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field()
  environment: string;

  @Field()
  message: string;

  @Field(() => Int)
  port: number;
}
