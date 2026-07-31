import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateUserCredentialInput } from './create-user-credential.input';

@InputType()
export class UpdateUserCredentialInput extends PartialType(
  CreateUserCredentialInput,
) {
  @Field(() => Int)
  id: number;
}
