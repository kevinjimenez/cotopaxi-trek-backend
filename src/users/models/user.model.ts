import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { RoleType } from 'src/databases/generated/prisma/enums';
import { Credential } from './credential.model';

registerEnumType(RoleType, { name: 'RoleType' });

@ObjectType()
export class User extends BaseModel {
  @Field()
  id: string;

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

  @Field(() => Credential, { nullable: true })
  credentials?: Credential;
}
