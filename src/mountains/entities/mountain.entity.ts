import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Mountain {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
