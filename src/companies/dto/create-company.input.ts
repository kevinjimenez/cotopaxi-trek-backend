import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  instagram?: string;

  @Field()
  @IsString()
  whatsapp: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
