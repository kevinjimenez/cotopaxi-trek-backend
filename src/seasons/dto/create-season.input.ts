import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateSeasonMountainInput } from './create-season-mountain.input';

@InputType()
export class CreateSeasonInput {
  @Field()
  @IsString()
  companyId: string;

  @Field()
  @IsString()
  @Length(2, 100)
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

  @Field(() => [CreateSeasonMountainInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeasonMountainInput)
  mountains: CreateSeasonMountainInput[];
}
