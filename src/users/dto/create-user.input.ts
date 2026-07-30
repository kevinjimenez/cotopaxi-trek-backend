import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleType } from 'src/databases/generated/prisma/enums';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  lastname: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field()
  @IsString()
  phone: string;

  @Field(() => RoleType, { nullable: true })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @Field()
  @IsString()
  password: string;
}
