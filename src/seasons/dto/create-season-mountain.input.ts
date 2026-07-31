import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSeasonMountainInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
