import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { SeasonMountain } from 'src/seasons/models/season-mountain.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Booking extends BaseModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  seasonMountainId?: number;

  @Field({ nullable: true })
  createdBy?: string;

  @Field()
  status: boolean;

  @Field(() => Date)
  bookedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => SeasonMountain, { nullable: true })
  seasonMountain?: SeasonMountain;
}
