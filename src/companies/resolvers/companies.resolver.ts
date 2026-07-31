import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCompanyInput } from '../dto/create-company.input';
import { Company } from '../models/company.model';
import { CompaniesService } from '../services/companies.service';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput);
  }

  @Query(() => [Company], { name: 'companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  // @Query(() => Company, { name: 'company' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.companiesService.findOne(id);
  // }

  // @Mutation(() => Company)
  // updateCompany(
  //   @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  // ) {
  //   return this.companiesService.update(
  //     updateCompanyInput.id,
  //     updateCompanyInput,
  //   );
  // }

  // @Mutation(() => Company)
  // removeCompany(@Args('id', { type: () => Int }) id: number) {
  //   return this.companiesService.remove(id);
  // }
}
