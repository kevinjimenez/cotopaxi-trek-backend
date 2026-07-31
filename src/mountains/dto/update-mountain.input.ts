import { CreateMountainInput } from './create-mountain.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMountainInput extends PartialType(CreateMountainInput) {
  @Field(() => Int)
  id: number;
}
