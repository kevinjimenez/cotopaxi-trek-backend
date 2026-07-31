import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserCredentialInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  password: string;
}
