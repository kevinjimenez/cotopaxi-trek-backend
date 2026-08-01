import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateCompanyInput } from '../dto/create-company.input';
import { UpdateCompanyInput } from '../dto/update-company.input';
import { CompaniesRepository } from '../repositories/companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  create(payload: CreateCompanyInput, tx?: PrismaTransaction) {
    return this.companiesRepository.create(payload, tx);
  }

  findAll(tx?: PrismaTransaction) {
    return this.companiesRepository.findAll(tx);
  }

  update(payload: UpdateCompanyInput, tx?: PrismaTransaction) {
    const { id, ...data } = payload;
    return this.companiesRepository.update(id, data, tx);
  }
}
