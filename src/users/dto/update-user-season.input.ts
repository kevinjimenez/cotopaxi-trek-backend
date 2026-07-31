import { CreateUserSeasonInput } from './create-user-season.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSeasonInput extends PartialType(CreateUserSeasonInput) {
  @Field(() => Int)
  id: number;
}
