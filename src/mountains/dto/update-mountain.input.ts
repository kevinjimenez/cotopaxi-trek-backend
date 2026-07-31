import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateMountainInput } from './create-mountain.input';

@InputType()
export class UpdateMountainInput extends PartialType(CreateMountainInput) {
  @Field(() => Int)
  id: number;
}
