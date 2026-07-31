import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateMountainInput } from './create-mountain.input';

@InputType()
export class UpdateMountainInput extends PartialType(CreateMountainInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
