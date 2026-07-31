import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateSeasonInput {
  @Field()
  @IsString()
  companyId: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  year: number;

  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  endDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
