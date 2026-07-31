import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateCompanyInput } from '../dto/create-company.input';
import { CompaniesRepository } from '../repositories/companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  create(createCompanyInput: CreateCompanyInput) {
    return this.companiesRepository.create(createCompanyInput);
  }

  findAll(tx?: PrismaTransaction) {
    return this.companiesRepository.findAll(tx);
  }
}
