import { CreateSeasonMountainInput } from './create-season-mountain.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeasonMountainInput extends PartialType(CreateSeasonMountainInput) {
  @Field(() => Int)
  id: number;
}
