import { CreateUserCredentialInput } from './create-user-credential.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserCredentialInput extends PartialType(CreateUserCredentialInput) {
  @Field(() => Int)
  id: number;
}
