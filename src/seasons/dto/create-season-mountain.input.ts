import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

@InputType()
export class CreateSeasonMountainInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  mountainId?: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  sortOrder: number;

  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}
