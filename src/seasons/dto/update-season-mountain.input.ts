import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateSeasonMountainInput } from './create-season-mountain.input';

@InputType()
export class UpdateSeasonMountainInput extends PartialType(
  CreateSeasonMountainInput,
) {
  @Field(() => Int)
  id: number;
}
