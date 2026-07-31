import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMountainInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
