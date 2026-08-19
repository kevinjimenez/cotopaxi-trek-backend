import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsString()
  @Length(2, 150)
  name: string;

  @Field()
  @IsString()
  @Length(2, 80)
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 7)
  primaryColor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  instagram?: string;

  @Field()
  @IsString()
  @Length(7, 20)
  whatsapp: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
