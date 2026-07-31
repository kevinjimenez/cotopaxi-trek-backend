import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
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

  @Field(() => Float)
  @IsNumber()
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
  status?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
