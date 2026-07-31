import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import type { Request } from 'express';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabasesModule } from './databases/databases.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { SeasonsModule } from './seasons/seasons.module';
import { MountainsModule } from './mountains/mountains.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    ConfigModule.forRoot(),
    HealthModule,
    CommonModule,
    DatabasesModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    SeasonsModule,
    MountainsModule,
  ],
})
export class AppModule {}
