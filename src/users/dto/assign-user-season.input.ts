import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBookingInput } from 'src/bookings/dto/create-booking.input';

@InputType()
export class AssignUserSeasonInput {
  @Field()
  @IsString()
  userId: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  seasonId: number;

  @Field(() => [CreateBookingInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingInput)
  bookings: CreateBookingInput[];
}
