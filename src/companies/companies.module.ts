import { Module } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companies.repository';
import { CompaniesResolver } from './resolvers/companies.resolver';
import { CompaniesService } from './services/companies.service';

@Module({
  providers: [CompaniesResolver, CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
