import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/base/base.model';
import { Company } from 'src/companies/models/company.model';
import { SeasonMountain } from 'src/seasons/models/season-mountain.model';

@ObjectType()
export class Mountain extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  companyId?: string;

  @Field()
  name: string;

  @Field(() => Float)
  altitudeMeters: number;

  @Field()
  location: string;

  @Field({ nullable: true })
  generalDescription?: string;

  @Field({ nullable: true })
  technicalDescription?: string;

  @Field()
  status: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => [SeasonMountain], { nullable: true })
  seasonMountains?: SeasonMountain[];
}
