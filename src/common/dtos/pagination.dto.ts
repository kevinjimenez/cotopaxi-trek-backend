import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { envs } from '../config/envs';

@InputType({ isAbstract: true })
export class PaginationDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(envs.paginationPage)
  @Type(() => Number)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(envs.paginationLimit)
  @Max(envs.paginationMax)
  @Type(() => Number)
  limit?: number;
}
