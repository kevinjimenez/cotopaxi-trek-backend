import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { Season } from 'src/seasons/models/season.model';
import { User } from './user.model';

@ObjectType()
export class UserSeason extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  seasonId?: number;

  @Field()
  status: boolean;

  @Field(() => Date)
  enrolledAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Season, { nullable: true })
  season?: Season;
}
