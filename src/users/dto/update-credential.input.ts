import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateCredentialInput } from './create-credential.input';

@InputType()
export class UpdateCredentialInput extends PartialType(CreateCredentialInput) {
  @Field(() => Int)
  id: number;
}
