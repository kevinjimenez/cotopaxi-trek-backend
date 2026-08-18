import { InputType } from '@nestjs/graphql';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';

@InputType()
export class MountainParamsDto extends QueryParamsDto {}
