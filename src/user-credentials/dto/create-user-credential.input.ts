import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserCredentialInput {
  @Field()
  @IsString()
  user_id: string;

  @Field()
  @IsString()
  password: string;
}
