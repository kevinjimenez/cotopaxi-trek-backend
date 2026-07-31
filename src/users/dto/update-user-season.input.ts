import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateUserSeasonInput } from './create-user-season.input';

@InputType()
export class UpdateUserSeasonInput extends PartialType(CreateUserSeasonInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
