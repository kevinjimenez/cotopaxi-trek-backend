import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { Mountain } from 'src/mountains/models/mountain.model';
import { Season } from 'src/seasons/models/season.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Company extends BaseModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  primaryColor?: string;

  @Field({ nullable: true })
  instagram?: string;

  @Field()
  whatsapp: string;

  @Field()
  status: boolean;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => [Season], { nullable: true })
  seasons?: Season[];

  @Field(() => [Mountain], { nullable: true })
  mountains?: Mountain[];
}
