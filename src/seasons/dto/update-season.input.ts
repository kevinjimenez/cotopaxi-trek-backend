import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateSeasonInput } from './create-season.input';

@InputType()
export class UpdateSeasonInput extends PartialType(CreateSeasonInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
