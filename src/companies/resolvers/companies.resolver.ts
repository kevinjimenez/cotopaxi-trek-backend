import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCompanyInput } from '../dto/create-company.input';
import { Company } from '../models/company.model';
import { CompaniesService } from '../services/companies.service';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company], { name: 'companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput);
  }
}
