import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateUserSeasonInput } from './create-user-season.input';

@InputType()
export class UpdateUserSeasonInput extends PartialType(CreateUserSeasonInput) {
  @Field(() => Int)
  id: number;
}
