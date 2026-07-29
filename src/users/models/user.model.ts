import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RoleType } from 'src/databases/generated/prisma/enums';

registerEnumType(RoleType, { name: 'RoleType' });

@ObjectType()
export class User {
  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field(() => RoleType)
  role: RoleType;

  @Field()
  status: boolean;
}
