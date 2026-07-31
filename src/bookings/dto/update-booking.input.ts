import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateBookingInput } from './create-booking.input';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field()
  @IsString()
  id: string;
}
