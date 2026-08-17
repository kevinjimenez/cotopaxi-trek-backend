import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';

@InputType()
export class SeasonParamsDto extends QueryParamsDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  id?: number;
}
