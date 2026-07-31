import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateSeasonMountainInput } from './create-season-mountain.input';

@InputType()
export class UpdateSeasonMountainInput extends PartialType(
  CreateSeasonMountainInput,
) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
