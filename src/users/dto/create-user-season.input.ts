import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateUserSeasonInput {
  @Field()
  @IsString()
  userId: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  seasonId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  enrolled?: boolean;
}
