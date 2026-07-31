import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateUserCredentialInput } from './create-user-credential.input';

@InputType()
export class UpdateUserCredentialInput extends PartialType(
  CreateUserCredentialInput,
) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
