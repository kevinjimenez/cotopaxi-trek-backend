import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsInt()
  @IsPositive()
  seasonMountainId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  bookedAt?: Date;
}
