import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Season {
  id: string
  companyId String? @map("company_id") @db.Uuid

  name: string
  year: number
  startDate DateTime @map("start_date") @db.Date
  endDate   DateTime @map("end_date") @db.Date
  isCurrent: string
}
