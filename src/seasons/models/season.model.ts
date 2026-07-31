import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { Company } from 'src/companies/models/company.model';

@ObjectType()
export class Season extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  companyId?: string;

  @Field()
  name: string;

  @Field(() => Int)
  year: number;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field()
  isCurrent: boolean;

  @Field(() => Company, { nullable: true })
  company?: Company;
}
