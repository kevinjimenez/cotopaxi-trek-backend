import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  lastname: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsOptional()
  @IsString()
  phone?: string;
}
