import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBookingInput } from 'src/bookings/dto/create-booking.input';
import { RoleType } from 'src/databases/generated/prisma/enums';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  companyId: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  seasonId: number;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

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

  @Field(() => [CreateBookingInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingInput)
  bookings: CreateBookingInput[];
}
