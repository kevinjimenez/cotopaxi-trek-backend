import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Booking } from 'src/bookings/models/booking.model';
import { BaseModel } from 'src/common/base/base.model';
import { Company } from 'src/companies/models/company.model';
import { RoleType } from 'src/databases/generated/prisma/enums';
import { UserCredential } from './user-credential.model';
import { UserSeason } from './user-season.model';

registerEnumType(RoleType, { name: 'RoleType' });

@ObjectType()
export class User extends BaseModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => RoleType)
  role: RoleType;

  @Field()
  status: boolean;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => UserCredential, { nullable: true })
  credentials?: UserCredential;

  @Field(() => [UserSeason], { nullable: true })
  userSeasons?: UserSeason[];

  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
}
