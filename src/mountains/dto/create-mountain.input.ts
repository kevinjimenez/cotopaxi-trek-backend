import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateMountainInput {
  @Field()
  @IsString()
  companyId: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  altitudeMeters: number;

  @Field()
  @IsString()
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  generalDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  technicalDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
