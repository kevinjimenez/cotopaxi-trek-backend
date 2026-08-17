import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class CreateMountainInput {
  @Field()
  @IsString()
  companyId: string;

  @Field()
  @IsString()
  @Length(2, 100)
  name: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  altitudeMeters: number;

  @Field()
  @IsString()
  @Length(2, 150)
  location: string;

  @Field()
  @IsOptional()
  @IsString()
  @Length(0, 150)
  reference?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

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
  @Length(0, 300)
  imageUrl?: string;
}
