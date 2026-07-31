import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Booking } from 'src/bookings/models/booking.model';
import { BaseModel } from 'src/common/base/base.model';
import { Mountain } from 'src/mountains/models/mountain.model';
import { Season } from './season.model';

@ObjectType()
export class SeasonMountain extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  seasonId?: number;

  @Field(() => Int, { nullable: true })
  mountainId?: number;

  @Field(() => Int)
  sortOrder: number;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => Float)
  price: number;

  @Field(() => Season, { nullable: true })
  season?: Season;

  @Field(() => Mountain, { nullable: true })
  mountain?: Mountain;

  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
}
